import Base from './base';
import {
	Remove,
	Insert,
} from './commands';

// Import for documentation
import * as BaseElementView from '../../../../elements/views/base'; // eslint-disable-line

export default class Move extends Base {
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
		if ( 'undefined' === typeof args[ 0 ] ) {
			throw Error( 'Index required.' );
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
		const toIndex = args[ 0 ],
			item = this.repeater.getItemModel( element, this.repeater.currentIndex ).toJSON();

		( new Remove( this.repeater ) ).apply( element );
		( new Insert( this.repeater ) ).apply( element, [ item, { at: toIndex } ] );
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
			toIndex = args[ 0 ],
			historyItem = Base.createHistory( 'moveRow', this.repeater, currentIndex, Move.restore );

		this.repeater.getSelection().forEach( ( element ) => {
			historyItem.elements[ element.model.id ] = {
				control: key,
				oldIndex: currentIndex,
				newIndex: toIndex,
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
				repeater.getItem( settings.oldIndex );
				repeater.move( settings.newIndex );
			} else {
				repeater.getItem( settings.newIndex );
				repeater.move( settings.oldIndex );
			}

			$eElement.scrollToView();
		} );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );
	}
}
