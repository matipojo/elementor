// Import for documentation
import * as BaseElementView from '../../../elements/views/base'; // eslint-disable-line

export default class Base {
	static historySubItems = {};

	/**
	 * eQuery elements.
	 *
	 * @type {Elements}
	 */
	elements = null;

	/**
	 * Function constructor().
	 *
	 * Create elements base command.
	 *
	 * @param {*} receiver
	 * @param {Boolean} autoInit
	 */
	constructor( receiver, autoInit = true ) {
		this.elements = receiver;

		if ( autoInit ) {
			this.initialize();
		}
	}

	/**
	 * Function initialize().
	 *
	 * Called after construction.
	 */
	initialize() {}

	/**
	 * Function apply().
	 *
	 * Do the actual command.
	 *
	 * @param {BaseElementView} element
	 * @param {Array} args
	 */
	apply( element, args ) {}

	/**
	 * Function validateArgs().
	 *
	 * do validation before apply, etc.
	 *
	 * @param {Array} args
	 */
	validateArgs( args ) {}

	/**
	 * Function logHistory().
	 *
	 * Log the history.
	 *
	 * @param {Array} args
	 */
	logHistory( args ) {}

	/**
	 * Function startHistory().
	 *
	 * Start writing history.
	 *
	 * @param  {Array} args
	 *
	 * @returns {Boolean|Number} historyID
	 */
	startHistory( args ) {
		if ( ! elementor.history.history.getActive() ) {
			return false;
		}

		this.logHistory( args );

		// Keep sub items count in order to close the history item
		// only after all recursive items are finished.
		const historyID = elementor.history.history.getCurrentID();

		if ( ! Base.historySubItems[ historyID ] ) {
			Base.historySubItems[ historyID ] = 0;
		}

		Base.historySubItems[ historyID ]++;

		return historyID;
	}

	/**
	 * Function endHistory().
	 *
	 * End history writing.
	 *
	 * @param {Number} historyID
	 */
	endHistory( historyID ) {
		Base.historySubItems[ historyID ]--;

		// All recursive items are finished.
		if ( ! Base.historySubItems[ historyID ] ) {
			elementor.history.history.endItem();
		}
	}

	/**
	 * Function run().
	 *
	 * Run the command.
	 *
	 * @param {*} args
	 *
	 * @returns {*}
	 */
	run( args ) {
		args = ( 'object' === typeof args ? Object.values( args ) : {} );

		this.validateArgs( args );

		const historyID = this.startHistory( args );

		const affected = [];

		this.elements.getSelection().forEach( ( /** BaseElementView */ element ) => {
			affected.push( this.apply( element, args ) );
		} );

		// Stop writing history.
		if ( historyID ) {
			this.endHistory( historyID );
		}

		return affected;
	}

	static getModelLabel( type ) {
		if ( ! Array.isArray( type ) ) {
			type = [ type ];
		}

		if ( 'document' === type[ 0 ] ) {
			return 'Document';
		}

		if ( type[ 1 ] ) {
			const config = elementor.config.widgets[ type[ 1 ] ];
			return config ? config.title : type[ 1 ];
		}

		const config = elementor.config.elements[ type[ 0 ] ];
		return config ? config.title : type[ 0 ];
	}

	static getTargetLabel( target ) {
		let title;
		if ( 1 === target.getSelection().length ) {
			const model = target.getSelection()[ 0 ].model;
			title = Base.getModelLabel( [ model.get( 'elType' ), model.get( 'widgetType' ) ] );
		} else {
			title = 'Elements';
		}

		return title;
	}

	static getControlLabel( settings, settingsArgs, target ) {
		const keys = Object.keys( settings );
		let label;

		if ( 1 === keys.length || settingsArgs.subChange ) {
			const controlKey = settingsArgs.subChange ? settingsArgs.subChange : keys[ 0 ],
				controlConfig = target.getSelection()[ 0 ].model.get( 'settings' ).controls[ controlKey ];
			label = controlConfig ? controlConfig.label : keys[ 0 ];
		} else {
			label = 'Settings';
		}

		return label;
	}

	static createHistory( type, target, subChange, restoreFn, elementType = '' ) {
		return {
			type: type,
			title: elementType ? Base.getModelLabel( elementType ) : Base.getTargetLabel( target ),
			// TODO: subTitle: Base.getControlLabel( {}, { subChange: subChange }, target ),
			elements: {},
			history: {
				behavior: {
					restore: restoreFn,
				},
			},
		};
	}
}
