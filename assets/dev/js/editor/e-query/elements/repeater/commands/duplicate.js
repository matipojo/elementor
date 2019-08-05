import Base from './base';
import {
	Insert,
} from './commands';

// Import for documentation
import * as BaseElementView from '../../../../elements/views/base'; // eslint-disable-line

export default class Duplicate extends Base {

	initialize() {
		this.resetIndexFlag = false;
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
		const item = this.repeater.getItemModel( element, this.repeater.currentIndex ).toJSON();

		( new Insert( this.repeater ) ).apply( element, [ item, { at: this.repeater.currentIndex + 1 } ] );

		this.repeater.currentIndex++;
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
			historyItem = Base.createHistory( 'duplicateRow', this.repeater, currentIndex, Insert.restore );

		this.repeater.getSelection().forEach( ( element ) => {
			historyItem.elements[ element.model.id ] = {
				control: key,
				item: this.repeater.getItemModel( element, currentIndex ).toJSON(),
				args: { at: currentIndex + 1 },
			};
		} );

		elementor.history.history.startItem( historyItem );
	}
}
