import Base from './base';

// Import for documentation
import * as BaseElementView from '../../../../elements/views/base'; // eslint-disable-line

export default class Settings extends Base {
	initialize() {
		this.resetIndexFlag = false;

		this.lazyLogSettingsHistory = _.debounce( this.logSettingsHistory.bind( this ), 800 );
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
			settings = args[ 0 ] || {},
			settingsModel = element.getEditModel().get( 'settings' ),
			subSettings = settingsModel.get( key ),
			item = subSettings.at( this.repeater.currentIndex );

		item.set( settings );

		settingsModel.trigger( `change:external:${ key }` );

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
		const settings = args[ 0 ],
			settingsArgs = args[ 1 ] ? args[ 1 ] : {},
			settingsKeys = Object.keys( settings );

		// @todo: check this in validateArgs
		if ( ! settingsKeys.length ) {
			return;
		}

		this.repeater.getSelection().forEach( ( element ) => {
			element.oldValues = element.oldValues || element.model.get( 'settings' ).get( this.repeater.key ).toJSON();
		} );

		// Try delay save only for one control (like text or color picker) but if history item started e.g. Section preset during delete column - do not delay the execution.
		if ( settingsArgs.lazyHistory && ! elementor.history.history.isItemStarted() ) {
			settingsArgs.currentIndex = this.repeater.currentIndex;

			this.lazyLogSettingsHistory( settings, settingsArgs );
		} else {
			this.logSettingsHistory( settings, settingsArgs );
		}
	}

	/**
	 * Function _saveSettings().
	 *
	 * Save settings changes to history.
	 *
	 * @param {{}} settings
	 * @param {{}} settingsArgs
	 */
	logSettingsHistory( settings, settingsArgs ) {
		const { key } = this.repeater,
			historyItem = Base.createHistory( 'change', this.repeater, settingsArgs, Settings.restore );

		// Fix lazy log settings history, when currentIndex affected from another commands.
		const currentIndex = settingsArgs.currentIndex || this.repeater.currentIndex;

		this.repeater.getSelection().forEach( ( /** BaseElementView */ element ) => {

			// TODO: ensure the element exist, for end cases its delete before lazy log settings history activated.

			const { id } = element.model;

			historyItem.elements[ id ] = {};
			historyItem.elements[ id ][ key ] = {};

			const changedAttributes = {};

			_.each( settings, ( value, controlName ) => {
				changedAttributes[ controlName ] = {
					old: element.oldValues[ currentIndex ][ controlName ],
					// Clone. don't save by reference.
					new: elementorCommon.helpers.cloneObject( value ),
				};
			} );

			historyItem.elements[ id ][ key ][ currentIndex ] = changedAttributes;
			delete element.oldValues;
		} );

		elementor.history.history.startItem( historyItem );
	}

	/**
	 * Function restoreSettings().
	 *
	 * Restore's item settings.
	 *
	 * @param {{}} historyItem
	 * @param {Boolean} isRedo
	 */
	static restore( historyItem, isRedo ) {
		_( historyItem.get( 'elements' ) ).each( ( settings, elementID ) => {
			const $eElement = $e( '#' + elementID );

			_( settings ).each( ( values, controlKey ) => {
				const tab = $eElement.get( controlKey );
				_( values ).each( ( changes, index ) => {
					_( changes ).each( ( changeValue, changeProp ) => {
						const changed = {};

						if ( isRedo ) {
							changed[ changeProp ] = changeValue.new;
						} else {
							changed[ changeProp ] = changeValue.old;
						}

						tab.getItem( index ).settings( changed );
					} );
				} );
			} );

			$eElement.scrollToView();
		} );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );
	}
}
