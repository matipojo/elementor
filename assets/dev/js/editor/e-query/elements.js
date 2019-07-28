export default class Elements {
	constructor( data ) {
		this.document = data.document;
		this.elements = data.elements;
	}

	getSelection() {
		return this.document.selection.get();
	}

	create( type, settings, args = {} ) {
		const targetElements = this.getSelection();

		if ( ! targetElements ) {
			throw Error( 'Empty target element.' );
		}

		if ( ! Array.isArray( type ) ) {
			type = [ type ];
		}

		const element = {
			elType: type[ 0 ],
			settings: settings,
		};

		if ( args.id ) {
			element.id = args.id;
			delete args.id;
		}

		if ( type[ 1 ] ) {
			// TODO: widgetType => subType.
			element.widgetType = type[ 1 ];
		}

		const newElements = [];

		targetElements.forEach( ( targetElement ) => {
			// Check typeof because at can be 0.
			if ( 'number' !== typeof args.at ) {
				args.at = targetElement.children.length + 1;
			}

			newElements.push( targetElement.addChildElement( element, args ) );
		} );

		return newElements;
	}

	cloneCollection( collection ) {
		const newCollection = new Backbone.Collection();

		collection.forEach( ( model ) => {
			newCollection.add( model.clone(), null, true );
		} );

		return newCollection;
	}

	repeaterRowAdd( repeaterId, newRow, args = {} ) {
		const newRows = {};

		this.getSelection().forEach( ( element ) => {
			const settingsModel = element.getEditModel().get( 'settings' ),
				collection = settingsModel.get( repeaterId );

			newRows[ element.getEditModel().id ] = collection.add( newRow, args.options );

			settingsModel.trigger( 'change:external:' + repeaterId );
		} );

		return newRows;
	}

	repeaterRowRemove( repeaterId, rowIndex, args = {} ) {
		this.getSelection().forEach( ( element ) => {
			const settingsModel = element.getEditModel().get( 'settings' ),
				collection = settingsModel.get( repeaterId ),
				at = _.isNumber( rowIndex ) ? rowIndex : collection.length - 1,
				model = collection.at( at );

			collection.remove( model, args );

			settingsModel.trigger( 'change:external:' + repeaterId );
		} );

		return true;
	}

	repeaterRowSettings( settings, repeater, rowIndex, args = {} ) {
		this.getSelection().forEach( ( element ) => {
			const settingsModel = element.getEditModel().get( 'settings' ),
				subSettings = settingsModel.get( repeater ),
				newSubSettings = this.cloneCollection( subSettings ),
				row = newSubSettings.at( rowIndex );

			row.set( settings );

			$e( '', element ).setting( repeater, newSubSettings, args );
		} );

		return true;
	}

	settings( settings, args = {} ) {
		this.getSelection().forEach( ( element ) => {
			const settingsModel = element.getEditModel().get( 'settings' );

			if ( args.external ) {
				settingsModel.setExternalChange( settings );
			} else {
				settingsModel.set( settings );
			}
		} );

		return true;
	}

	setting( key, value, args = {} ) {
		const settings = {};

		settings[ key ] = value;

		// Use receiver in order to log history.
		return this.receiver.settings( settings, args );
	}

	subSetting( key, value, subSetting, args = {} ) {
		const settings = {};

		settings[ key ] = value;

		args.subChange = key;

		// Use receiver in order to log history.
		return this.receiver.subSettings( settings, subSetting, args );
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
		const newElements = [];

		this.getSelection().forEach( ( element ) => {
			const model = element.model.toJSON();

			args.id = model.id;
			args.onBeforeAdd = () => {
				element._isRendering = true;
				element._parent.collection.remove( element.model );
			};

			const $newElement = $eElement.create( [ model.elType, model.widgetType ], model.settings, args );
			newElements.push( $newElement.context[ 0 ] );
		} );

		return $e( '', newElements );
	}

	duplicate() {
		this.copy( 'duplicate' );

		return $e( '', this.getSelection()._parent ).paste( 'duplicate' );
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
		this.getSelection().forEach( ( element ) => element.removeElement() );

		this.document.selection.reset();

		return true;
	}

	resetStyle() {
		this.getSelection().forEach( ( element ) => element.resetStyle() );

		return true;
	}

	getSettings() {
		return this.getSelection()[ 0 ].model.get( 'settings' );
	}
}
