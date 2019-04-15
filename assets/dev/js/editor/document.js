class Container {
	constructor( data ) {
		this.document = data.document;
		this.elements = data.elements;
		this.settings = data.settings;
	}
}

const History = {
	get( target, propKey, receiver ) {
		if ( ! target[ propKey ] ) {
			return;
		}

		const origMethod = target[ propKey ];
		return ( ...args ) => {
			const historyIsActive = elementor.history.history.getActive();

			if ( historyIsActive && this[ propKey ] ) {
				this[ propKey ].apply( this, [ args, target ] );
			}

			// don't push to args, to avoid wrong args.
			target.receiver = receiver;

			let result = origMethod.apply( target, args );

			if ( historyIsActive && this[ propKey ] ) {
				elementor.history.history.endItem();
			}

			return result;
		};
	},

	getModelLabel( type ) {
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
	},

	create( args, target ) {
		elementor.history.history.startItem( {
			type: 'add',
			title: 1 === target.getSelection().length ? this.getModelLabel( args[ 0 ] ) : 'Elements',
			elementType: args[ 0 ],
		} );
	},

	settings( args, target ) {
		const settings = args[ 0 ],
			settingsArgs = args[ 1 ] ? args[ 1 ] : {},
			settingsKeys = Object.keys( settings );

		if ( ! settingsKeys.length ) {
			return;
		}

		target.getSelection().forEach( ( element ) => {
			element.oldValues = element.oldValues || element.model.get( 'settings' ).toJSON();
		} );

		// Try delay save only for one control (like text or color picker) but if history item started e.g. Section preset during delete column - do not delay the execution.
		if ( 1 === settingsKeys.length && ! elementor.history.history.isItemStarted() ) {
			this.lazySaveChangeHistory( settings, settingsArgs, target );
		} else {
			this.saveChangeHistory( settings, settingsArgs, target );
		}
	},

	restoreChanges: function( historyItem, isRedo ) {
		_( historyItem.get( 'elements' ) ).each( ( settings, elementID ) => {
			const restoredValues = {};
			_( settings ).each( ( values, key ) => {
				if ( isRedo ) {
					restoredValues[ key ] = values.new;
				} else {
					restoredValues[ key ] = values.old;
				}
			} );

			const $eElement = $e( '#' + elementID );
			$eElement.settings( restoredValues, { external: true } );
			$eElement.scrollToView();
		} );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );
	},

	saveChangeHistory( settings, settingsArgs, target ) {
		const historyItem = {
			type: 'change',
			title: this.getTargetLabel( target ),
			subTitle: this.getControlLabel( settings, settingsArgs, target ),
			elements: {},
			history: {
				behavior: {
					restore: this.restoreChanges.bind( this ),
				},
			},
		};

		target.getSelection().forEach( ( element ) => {
			const changedAttributes = {};

			_.each( settings, function( value, controlName ) {
				changedAttributes[ controlName ] = {
					old: element.oldValues[ controlName ],
					new: value,
				};
			} );

			historyItem.elements[ element.model.id ] = changedAttributes;
			delete element.oldValues;
		} );

		elementor.history.history.addItem( historyItem );
	},

	getTargetLabel: function( target ) {
		let title;
		if ( 1 === target.getSelection().length ) {
			const model = target.getSelection()[ 0 ].model;
			title = this.getModelLabel( [ model.get( 'elType' ), model.get( 'widgetType' ) ] );
		} else {
			title = 'Elements';
		}

		return title;
	},

	getControlLabel( settings, settingsArgs, target ) {
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
	},

	moveTo( args, target ) {
		elementor.history.history.startItem( {
			type: 'move',
			title: this.getTargetLabel( target ),
		} );
	},
};

History.lazySaveChangeHistory = _.debounce( History.saveChangeHistory.bind( History ), 800 );

class Elements {
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

	settings( settings, args = {} ) {
		this.getSelection().forEach( ( element ) => {
			element.model.get( 'settings' ).set( settings );

			if ( args.external ) {
				const settingsModel = element.getEditModel().get( 'settings' );
				jQuery.each( settings, function( key, value ) {
					settingsModel.trigger( 'change:external:' + key, value );
				} );
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
		const models = this.getSelection().map( ( element ) => element.model );

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

				newElements.push( $eTarget.create( [ model.elType, model.widgetType ], model.settings, { at: index, clone: true } ) );
			} );
		} );

		return newElements;
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

	pasteStyle() {
		return updatedElement;
	}

	resetStyle() {
		return updatedElement;
	}
}

class Selection {
	constructor( args ) {
		this.document = args.document;
		this.elements = [];
	}

	children() {
		// TODO
		const children = this.get()[ 0 ].children;
		this.set( children );

		return this;
	}

	first() {
		// TODO
		const element = this.children().getSelection()[ 0 ];
		this.set( element );

		return this;
	}

	last() {
		// TODO
		const element = this.get()[ 0 ].children.last();
		this.set( element );

		return this;
	}

	get() {
		return this.elements;
	}

	set( elements ) {
		if ( ! Array.isArray( elements ) ) {
			elements = [ elements ];
		}

		this.reset().addMultiple( elements );

		return this;
	}

	reset() {
		this.elements = [];

		return this;
	}

	add( element ) {
		this.elements.push( element );

		return this;
	}

	addMultiple( elements ) {
		elements.forEach( ( element ) => this.add( element ) );

		return this;
	}

	remove() {
		// TODO
		return this;
	}
}

class Settings {
	constructor( args ) {
		this.settings = args.settings;
	}
}

class eQuery {
	constructor( selector, context ) {
		this.selector = selector;

		if ( 'undefined' === typeof selector || '#document' === selector ) {
			this.context = [ elementor.documentView ];
		} else if ( 'string' === typeof selector && '#' === selector[ 0 ] ) {
			this.context = this.getById( selector.replace( '#', '' ) );
		} else {
			if ( ! Array.isArray( context ) ) {
				context = [ context ];
			}
			this.context = context;
		}
	}

	createSection( columns = 1, settings, args ) {
		// Temp: decrease columns because the editor adds one automatically.
		columns--;

		const $eSection = this.create( 'section', settings, args );

		for ( let i = 0; i < columns; i++ ) {
			$eSection.create( 'column' );
		}

		return $eSection;
	}

	createWidget( type, settings, args ) {
		return this.create( [ 'widget', type ], settings, args );
	}

	findRecursive( elements, id ) {
		for ( let x in elements.models ) {
			let model = elements.models[ x ];

			if ( id === model.get( 'id' ) ) {
				return model;
			}

			if ( model.get( 'elements' ) ) {
				model = this.findRecursive( model.get( 'elements' ), id );
				if ( model ) {
					return model;
				}
			}
		}

		return false;
	}

	findViewRecursive( parent, key, value, multiple = true ) {
		let found = [];
		for ( let x in parent._views ) {
			let view = parent._views[ x ];

			if ( value === view.model.get( key ) ) {
				found.push( view );
				if ( ! multiple ) {
					return found;
				}
			}

			if ( view.children ) {
				const views = this.findViewRecursive( view.children, key, value, multiple );
				if ( views.length ) {
					found = found.concat( views );
					if ( ! multiple ) {
						return found;
					}
				}
			}
		}

		return found;
	}

	getById( id ) {
		return this.findViewRecursive( elementor.sections.currentView.children, 'id', id, false );
	}

	find( type ) {
		if ( ! Array.isArray( type ) ) {
			type = [ type ];
		}

		let root, elements,
			found = [];

		this.context.forEach( ( element ) => {
			if ( element.children ) {
				root = element.children;
			} else if ( element.sections ) {
				// Page Container.
				root = elementor.sections.currentView.children;
			}

			if ( type[ 1 ] ) {
				elements = this.findViewRecursive( root, 'widgetType', type[ 1 ] );
			} else {
				elements = this.findViewRecursive( root, 'elType', type[ 0 ] );
			}

			found = found.concat( elements );
		} );

		return $e( '', found );
	}

	scrollToView() {
		if ( ! this.context.length ) {
			return;
		}

		const $el = this.context[ 0 ].$el;

		if ( ! elementor.helpers.isInViewport( $el[ 0 ], elementor.$previewContents.find( 'html' )[ 0 ] ) ) {
			elementor.helpers.scrollToView( $el );
		}
	}
}

export default class Document extends elementorModules.Module {
	constructor( args ) {
		super( ...args );

		args.document = this;

		this.type = args.type;

		this.elements = new Proxy( new Elements( args ), History );
		this.settings = new Settings( args );
		this.selection = new Selection( args );

		this.status = 'saved';

		this.registerEQuery();
	}

	registerEQuery() {
		const proxyHandler = {
			get: ( target, propKey, receiver ) => {
				if ( propKey in target ) {
					return target[ propKey ];
				}

				if ( this.elements[ propKey ] ) {
					return ( ...args ) => {
						if ( target.context ) {
							this.selection.set( target.context );
						}

						const results = this.elements[ propKey ].apply( this.elements, args );

						// Update
						if ( 'boolean' === typeof results ) {
							return receiver;
						}

						// Move/Add keep context for current element.
						if ( results instanceof eQuery ) {
							target.context = results.context;

							return results;
						}

						// Create
						return $e( '', results );
					};
				}
			},
		};

		window.$e = ( selector, context ) => new Proxy( new eQuery( selector, context ), proxyHandler );
	}
}

class Test extends elementorModules.Module {
	constructor( ...args ) {
		super( ...args );

		// Create a section at end of document.
		$e().create( 'section' ); // Page -> Sections -> Last
		$e().copy(); // Page -> Sections -> All
		$e().duplicate(); // Page -> Sections -> All
		$e().paste(); // Page -> Sections -> Last
		$e().remove(); // Page -> Sections -> All
		$e().settings(); // Page -> Settings Model
		$e().moveTo(); // ????

		// Create a section with settings.
		var $eSection;

		$eSection = $e().create( 'section', {
			background_background: 'classic',
			background_color: '#7a7a7a',
		} );

		// Create a section in a specific position.
		$eSection = $e().create( 'section', {}, {
			at: 0,
		} );

		// Select & Move by id. e.g. $e( '#akjxzk' ).moveTo( $e( '#bccdsd' ));
		// buggy! because the $eSection is destroyed during the move.
		$e( '#' + $eSection.context[ 0 ].model.id ).moveTo( $e(), { at: 0 } );

		// Create a section and add a widget.
		$e().create( 'section' ).create( 'column' ).create( [ 'widget', 'heading' ] );

		// Separated actions.
		$eSection = $e().create( 'section' );
		$eColumn2 = $eSection.create( 'column' );
		$eHeading = $eColumn2.create( [ 'widget', 'heading' ], {
			title: 'Hi, I\'m an Heading',
		} );

		// Add a widget at top of the column.
		$eColumn2.create( [ 'widget', 'button' ],
			{
				title: 'Click Me',
			},
			{
				at: 0,
			}
		);

		// Update widget settings.
		$eHeading.settings( {
			title: 'I\'m a Changed title',
		} );

		// Select element by ID.
		$e( '#3fe3306' ).settings( {
			_background_background: 'classic',
			_background_image: {
				url: 'http://localhost/elementor/wp-content/uploads/2019/02/library.jpg',
				id: 22589,
			},
		} );

		let $eColumn3 = $eSection.create( 'column' );

		// Move widget.
		$eHeading.moveTo( $eColumn3 );
		$eHeading.moveTo( $eColumn2, { at: 0 } );

		// Drag from panel.
		let $eVideo = $eColumn3.create( [ 'widget', 'video' ] );

		// Lazy save
		$eHeading
			.settings( {
				title: 'Hi, I\'m a title #1',
			} )
			.settings( {
				title: 'Hi, I\'m a title #2',
			} )
			.settings( {
				title: 'Hi, I\'m a title #3',
			} );

		// Multiple elements & multiple settings.
		$eHeading.add( $eHeading2 )
			.settings( {
				title: 'Hi, I\'m a red title',
				title_color: 'red',
			} )
			.settings( {
				title: 'Hi, I\'m blue title',
				title_color: 'blue',
			} )
			.settings( {
				title: 'Hi, I\'m green title',
				title_color: 'green',
			} );

		/////////////////////////////////////////////////

		// Copy elements.
		$eHeading.add( $eVideo ).copy();

		// Paste.
		$eColumn2.paste();

		// Remove.
		$eVideo.remove();

		//Remove again without errors
		$eVideo.remove();

		// Paste Style.
		$eHeading.copy();

		$eColumn3.find( 'heading' ).pasteStyle();

		// Paste Style directly.
		$eColumn3.find( 'heading' ).pasteStyle( $eHeading );

		$e.settings( {
			_background_background: 'classic',
			_background_image: {
				url: 'http://localhost/elementor/wp-content/uploads/2019/02/library.jpg',
				id: 22589,
			},
		} );

		$e.save();
	}
}
