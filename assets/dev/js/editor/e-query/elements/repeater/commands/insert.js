import Base from './base';

// Import for documentation
import * as BaseElementView from '../../../../elements/views/base'; // eslint-disable-line

export default class Insert extends Base {
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
		if ( ! args.length ) {
			throw Error( 'Arguments are required.' );
		}
	}

	/**
	 * Function apply().
	 *
	 * Do the actual command.
	 *
	 * @param {BaseElementView} element
	 * @param {Array} args
	 */
	apply( element, args ) {
		const { key } = this.repeater,
			item = args[ 0 ],
			settings = args[ 1 ] || {},
			settingsModel = element.getEditModel().get( 'settings' );

		settingsModel.get( key ).push( item, settings );

		settingsModel.trigger( 'change:external:' + key );

		element.renderOnChange( settingsModel );
	}

	/**
	 * Function logHistory().
	 *
	 * Log command history.
	 *
	 * @param {Array} args
	 */
	logHistory( args ) {
		const { currentIndex, key } = this.repeater,
			item = args[ 0 ],
			settingsArgs = args[ 1 ] || {},
			historyItem = Base.createHistory( 'addRow', this.repeater, currentIndex, Insert.restore );

		this.repeater.getSelection().forEach( ( element ) => {
			historyItem.elements[ element.model.id ] = {
				control: key,
				item: elementorCommon.helpers.cloneObject( item ),
				args: settingsArgs,
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
			const repeater = $eElement.get( settings.control );

			if ( isRedo ) {
				repeater.insert( settings.item, settings.args );
			} else {
				let at = settings.args.at;
				if ( 'undefined' === typeof at ) {
					at = $eElement.getSettings().get( settings.control ).length - 1;
				}
				repeater.getItem( at ).remove();
			}

			$eElement.scrollToView();
		} );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );
	}
}
