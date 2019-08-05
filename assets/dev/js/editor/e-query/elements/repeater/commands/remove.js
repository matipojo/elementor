import Base from './base';
import InsertCommand from './insert';

// Import for documentation
import * as BaseElementView from '../../../../elements/views/base'; // eslint-disable-line

export default class Remove extends Base {
	/**
	 * Function apply().
	 *
	 * Do the actual command.
	 *
	 * @param {BaseElementView} element
	 * @param {Array} args
	 */
	apply( element, args = [] ) {
		const settingsModel = element.getEditModel().get( 'settings' ),
			collection = settingsModel.get( this.repeater.key ),
			model = collection.at( this.repeater.currentIndex );

		collection.remove( model );

		settingsModel.trigger( 'change:external:' + this.key );

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
			historyItem = Base.createHistory( 'removeRow', this.repeater, currentIndex, Remove.restore );

		this.repeater.getSelection().forEach( ( element ) => {
			historyItem.elements[ element.model.id ] = {
				control: key,
				item: this.repeater.getItemModel( element, currentIndex ).toJSON(),
				args: { at: currentIndex },
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
		InsertCommand.restore( historyItem, ! isRedo );
	}
}
