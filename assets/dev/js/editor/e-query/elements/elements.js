import Commands from './commands/commands';
import Repeater from './repeater/repeater';

export default class Elements {
	constructor( data ) {
		this.document = data.document;
		this.elements = data.elements;
	}

	get( setting ) {
		return new Repeater( {
			elements: this.getSelection(),
			key: setting,
		} );
	}

	getSelection() {
		return this.document.selection.get();
	}

	getSettings() {
		return this.getSelection()[ 0 ].model.get( 'settings' );
	}

	create( type, settings, args = {} ) {
		return ( new Commands.Create( this ) ).run( { type, settings, args } );
	}

	settings( settings, args = {} ) {
		return ( new Commands.Settings( this ) ).run( { settings, args } );
	}

	setting( key, value, args = {} ) {
		const settings = {};

		settings[ key ] = value;

		return this.settings( settings, args );
	}

	subSetting( key, value, subSetting, args = {} ) {
		const settings = {};

		settings[ key ] = value;

		args.subChange = key;

		return this.subSettings( settings, subSetting, args );
	}

	subSettings( settings, subSetting, args = {} ) {
		this.getSelection().forEach( ( element ) => {
			const settingsModel = element.getEditModel().get( 'settings' ),
				subSettings = settingsModel.get( subSetting ) || {},
				newSettings = {},
				clonedSettings = elementorCommon.helpers.cloneObject( subSettings );

			_( settings ).each( ( value, key ) => {
				clonedSettings[ key ] = value;
			} );

			newSettings[ subSetting ] = clonedSettings;

			$e( '', element ).settings( newSettings, args );
		} );

		return true;
	}

	moveTo( $eElement, args = {} ) {
		return ( new Commands.Move( this ) ).run( { $eElement, args } );
	}

	duplicate() {

	}

	copy( storageKey = 'clipboard' ) {
		const models = this.getSelection().map( ( element ) => {
			return element.model;
		} );

		elementorCommon.storage.set( storageKey, models );

		return true;
	}

	paste( storageKey = 'clipboard' ) {
		const clipboardModels = elementorCommon.storage.get( storageKey ),
			newElements = [];

		this.getSelection().forEach( ( element ) => {
			let index;
			if ( element._parent.collection ) {
				index = element._parent.collection.indexOf( element.model );
			} else if ( element.collection ) {
				// Page Container.
				index = element.collection.length;
			}

			clipboardModels.forEach( ( model ) => {
				index++;
				const $eTarget = element.model.id === model.id ? $e( '', element._parent ) : $e( '', element );
				const $newElement = $eTarget.create( [ model.elType, model.widgetType ], model.settings, { at: index, clone: true } );
				newElements.push( $newElement.context[ 0 ] );
			} );
		} );

		return newElements;
	}

	pasteStyle( storageKey = 'clipboard' ) {
		// TODO: Use storageKey in pasteStyle.
		elementorCommon.storage.set( 'transfer', {
			elements: elementorCommon.storage.get( storageKey ),
		} );

		this.getSelection().forEach( ( element ) => element.pasteStyle() );

		return true;
	}

	parent() {
		const parents = [];

		this.getSelection().forEach( ( element ) => parents.push( element._parent ) );

		return parents;
	}

	add( $eElement ) {
		let elements = this.getSelection(),
			existIds = elements.map( ( element ) => element.model.id );

		$eElement.context.forEach( ( element ) => {
			if ( -1 === existIds.indexOf( element.model.id ) ) {
				elements = elements.concat( [ element ] );
			}
		} );

		return $e( '', elements );
	}

	remove() {
		return ( new Commands.Remove( this ) ).run( { } );
	}

	resetStyle() {
		this.getSelection().forEach( ( element ) => element.resetStyle() );

		return true;
	}


}
