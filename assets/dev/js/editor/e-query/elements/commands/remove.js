import Base from './base';

export default class Remove extends Base {
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
		element.removeElement();

		// TODO:
		// check if it the last element and then do:
		// this.document.selection.reset();
	}

	/**
	 * Function logHistory().
	 *
	 * Log command history.
	 *
	 * @param {Array} args
	 */
	logHistory( args ) {
		let title;
		const selection = this.elements.getSelection();

		if ( 1 === selection.length ) {
			const element = selection[ 0 ],
				model = [ element.model.get( 'elType' ), element.model.get( 'widgetType' ) ];

			title = Base.getModelLabel( model );
		} else {
			title = 'Elements';
		}

		elementor.history.history.startItem( {
			type: 'remove',
			title: title,
			elementType: args[ 0 ],
		} );
	}
}
