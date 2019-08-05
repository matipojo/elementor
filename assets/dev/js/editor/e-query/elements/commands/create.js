import Base from './base';

export default class Create extends Base {
	/**
	 * Function validateArgs().
	 *
	 * Validate command args.
	 *
	 * @param {Array} args
	 *
	 * @throw Error
	 */
	validateArgs( args ) {
		if ( ! this.elements.getSelection() ) {
			throw Error( 'Empty target element.' );
		}
	}

	/**
	 * Function apply().
	 *
	 * Do the actual command.
	 *
	 * @param {*} element
	 * @param {Array} args
	 *
	 * @returns {{}} ( Appended element )
	 */
	apply( element, args ) {
		let type = args[ 0 ];
		const settings = args[ 1 ] || {},
			options = args[ 2 ] || {};

		if ( ! Array.isArray( type ) ) {
			type = [ type ];
		}

		const newElement = {
			elType: type[ 0 ],
			settings: settings,
		};

		if ( options.id ) {
			newElement.id = options.id;
			delete options.id;
		}

		if ( type[ 1 ] ) {
			// TODO: widgetType => subType.
			newElement.widgetType = type[ 1 ];
		}

		// Check typeof because at can be 0.
		if ( 'number' !== typeof options.at ) {
			options.at = element.children.length + 1;
		}

		const newChildElement = element.addChildElement( newElement, options );

		if ( elementor.history.history.getActive() ) {
			// TODO: failed when creating a section and auto create column via, section._checkIsEmpty().
			elementor.history.history.getItems().at( 0 ).get( 'items' ).at( 0 ).get( 'elements' )[ element.getID() ] = newChildElement.getID();
		}

		return newChildElement;
	}

	/**
	 * Function logHistory().
	 *
	 * Log command history.
	 *
	 * @param {Array} args
	 */
	logHistory( args ) {
		const type = args[ 0 ],
			settings = args[ 1 ] || {},
			options = args[ 2 ] || {};

		const historyItem = Base.createHistory( 'add', this.elements, options, Create.restore, type );

		historyItem.elementType = type;
		historyItem.settings = settings;
		historyItem.options = options;

		elementor.history.history.startItem( historyItem );
	}

	/**
	 * Function restore().
	 *
	 * Restore's insert
	 *
	 * @param {{}} historyItem
	 * @param {Boolean} isRedo
	 */
	static restore( historyItem, isRedo ) {
		_( historyItem.get( 'elements' ) ).each( ( childID, parentID ) => {
			let $eElement;
			if ( isRedo ) {
				$eElement = $e( '#' + parentID );
				const options = historyItem.get( 'options' );
				options.id = childID;
				$eElement.create( historyItem.get( 'elementType' ), historyItem.get( 'settings' ), options );
			} else {
				$eElement = $e( '#' + childID );
				$eElement.remove();
			}

			$eElement.scrollToView();
		} );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );
	}
}
