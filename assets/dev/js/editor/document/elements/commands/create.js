import History from '../../commands/base/history';

export class Create extends History {
	static restore( historyItem, isRedo ) {
		const data = historyItem.get( 'data' ),
			container = historyItem.get( 'container' ),
			options = historyItem.get( 'options' ) || {};

		// No clone when restoring. e.g: duplicate will generate unique ids while restoring.
		if ( options.clone ) {
			options.clone = false;
		}

		if ( isRedo ) {
			$e.run( 'document/elements/create', {
				container,
				model: data.toRestoreModel,
				options,
			} );
		} else {
			$e.run( 'document/elements/delete', { container: data.toRestoreContainer } );
		}
	}

	validateArgs( args ) {
		this.requireContainer( args );

		// Avoid Backbone model & etc.
		this.requireArgumentConstructor( 'model', Object, args );
	}

	getHistory( args ) {
		const { model, containers = [ args.container ] } = args;

		return {
			containers,
			model,
			type: 'add',
			title: elementor.history.history.getModelLabel( model ),
		};
	}

	apply( args ) {
		const { model, options = {}, containers = [ args.container ] } = args;

		let result = [];

		containers.forEach( ( container ) => {
			container = container.lookup();

			const createdContainer = container.view.addChildElement( model, options ).getContainer();

			result.push( createdContainer );

			/**
			 * Acknowledge history of each created item, because we cannot pass the elements when they do not exist
			 * in getHistory().
			 */
			if ( this.isHistoryActive() ) {
				$e.run( 'document/history/add-sub-item', {
					container,
					type: 'sub-add',
					restore: this.constructor.restore,
					options,
					data: {
						toRestoreContainer: createdContainer,
						toRestoreModel: createdContainer.model.toJSON(),
					},
				} );
			}
		} );

		if ( 1 === result.length ) {
			result = result[ 0 ];
		}

		return result;
	}
}

export default Create;