import Base from './base';

export default class Move extends Base {
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
		const $eTarget = args[ 0 ],
			settingsArgs = args[ 1 ];

		const model = element.model.toJSON();

		settingsArgs.id = model.id;

		$e( '#' + element.model.id ).remove();

		const $newElement = $eTarget.create( [ model.elType, model.widgetType ], model.settings, settingsArgs );

		$eTarget.context[ 0 ].renderOnChange( $eTarget.getSettings() );

		return $newElement.context[ 0 ];
	}

	/**
	 * Function logHistory().
	 *
	 * Log command history.
	 *
	 * @param {Array} args
	 */
	logHistory( args ) {
		const $eTarget = args[ 0 ],
			settingsArgs = args[ 1 ];

		const historyItem = Base.createHistory( 'move', this.elements, settingsArgs, Move.restore );

		this.elements.getSelection().forEach( ( /** BaseElementView */ element ) => {
			historyItem.elements[ element.model.id ] = {
				oldParentID: element._parent.getID(),
				newParentID: $eTarget.context[ 0 ].getID(),
			};
		} );


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
		_( historyItem.get( 'elements' ) ).each( ( settings, elementID ) => {
			const $eElement = $e( '#' + elementID );

			if ( isRedo ) {
				$eElement.moveTo( $e( '#' + settings.newParentID ) );
			} else {
				$eElement.moveTo( $e( '#' + settings.oldParentID ) );
			}

			$eElement.scrollToView();
		} );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );
	}
}
