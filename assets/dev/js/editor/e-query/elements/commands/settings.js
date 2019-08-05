import Base from './base';

// Import for documentation
import * as BaseElementView from '../../../elements/views/base'; // eslint-disable-line

export default class Settings extends Base {
	initialize() {
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
		const settingsArgs = args[ 0 ],
			settingsModel = element.getEditModel().get( 'settings' );

		if ( settingsArgs.external ) {
			settingsModel.setExternalChange( settingsArgs );
		} else {
			settingsModel.set( settingsArgs );
		}
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

		if ( ! settingsKeys.length ) {
			return;
		}

		this.elements.getSelection().forEach( ( element ) => {
			element.oldValues = element.oldValues || element.model.get( 'settings' ).toJSON();
		} );

		// Try delay save only for one control (like text or color picker) but if history item started e.g. Section preset during delete column - do not delay the execution.
		if ( settingsArgs.lazyHistory && ! elementor.history.history.isItemStarted() ) {
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
		const historyItem = Base.createHistory( 'change', this.elements, settingsArgs, Settings.restore );

		this.elements.getSelection().forEach( ( /** BaseElementView */ element ) => {
			const changedAttributes = {};

			_.each( settings, ( value, controlName ) => {
				changedAttributes[ controlName ] = {
					old: element.oldValues[ controlName ],
					// Clone. don't save by reference.
					new: elementorCommon.helpers.cloneObject( value ),
				};
			} );

			historyItem.elements[ element.model.id ] = changedAttributes;

			delete element.oldValues;
		} );

		elementor.history.history.startItem( historyItem );
	}

	/**
	 * Function restore().
	 *
	 * Restore's item settings.
	 *
	 * @param {{}} historyItem
	 * @param {Boolean} isRedo
	 */
	static restore( historyItem, isRedo ) {
		_( historyItem.get( 'elements' ) ).each( ( settings, elementID ) => {
			const $eElement = $e( '#' + elementID ),
				restoredValues = {};
			_( settings ).each( ( values, key ) => {
				if ( isRedo ) {
					restoredValues[ key ] = values.new;
				} else {
					restoredValues[ key ] = values.old;
				}
			} );

			$eElement.settings( restoredValues, { external: true } );
			$eElement.scrollToView();
		} );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );
	}
}
