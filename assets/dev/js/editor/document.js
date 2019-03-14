class Container {
	constructor( data ) {
		this.document = data.document;
		this.elements = data.elements;
		this.settings = data.settings;
	}
}

var History = {
	get( target, propKey ) {
		if ( ! target[ propKey ] ) {
			return;
		}

		const origMethod = target[ propKey ];
		return ( ...args ) => {
			if ( this[ propKey ] ) {
				this[ propKey ].apply( this, [ args, target ] );
			}

			let result = origMethod.apply( target, args );

			if ( this[ propKey ] ) {
				elementor.history.history.endItem();
			}

			return result;
		};
	},

	getModelLabel( type ) {
		if ( ! Array.isArray( type ) ) {
			type = [ type ];
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
		elementor.history.history.startItem( {
			type: 'change',
			title: this.getTargetLabel( target ),
		} );
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

	moveTo( args, target ) {
		elementor.history.history.startItem( {
			type: 'move',
			title: this.getTargetLabel( target ),
		} );
	},

	saveHistory: function( model, options ) {
		if ( ! elementor.history.history.getActive() ) {
			return;
		}

		var self = this,
			changed = Object.keys( model.changed ),
			control = model.controls[ changed[ 0 ] ];

		if ( ! control && options && options.control ) {
			control = options.control;
		}

		if ( ! changed.length || ! control ) {
			return;
		}

		if ( 1 === changed.length ) {
			if ( _.isUndefined( self.oldValues[ control.name ] ) ) {
				self.oldValues[ control.name ] = model.previous( control.name );
			}

			if ( elementor.history.history.isItemStarted() ) {
				// Do not delay the execution
				self.saveTextHistory( model, changed, control );
			} else {
				self.lazySaveTextHistory( model, changed, control );
			}

			return;
		}

		var changedAttributes = {};

		_.each( changed, function( controlName ) {
			changedAttributes[ controlName ] = {
				old: model.previous( controlName ),
				new: model.get( controlName ),
			};
		} );

		var historyItem = {
			type: 'change',
			elementType: 'control',
			title: elementor.history.history.getModelLabel( model ),
			history: {
				behavior: this,
				changed: changedAttributes,
				model: this.view.getEditModel().toJSON(),
			},
		};

		if ( 1 === changed.length ) {
			historyItem.subTitle = control.label;
		}

		elementor.history.history.addItem( historyItem );
	},

	restore: function( historyItem, isRedo ) {
		var	history = historyItem.get( 'history' ),
			modelID = history.model.id,
			view = elementor.history.history.findView( modelID );

		if ( ! view ) {
			return;
		}

		var model = view.getEditModel ? view.getEditModel() : view.model,
			settings = model.get( 'settings' ),
			behavior = view.getBehavior( 'ElementHistory' );

		// Stop listen to restore actions
		behavior.stopListening( settings, 'change', this.saveHistory );

		var restoredValues = {};
		_.each( history.changed, function( values, key ) {
			if ( isRedo ) {
				restoredValues[ key ] = values.new;
			} else {
				restoredValues[ key ] = values.old;
			}
		} );

		// Set at once.
		settings.setExternalChange( restoredValues );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );

		// Listen again
		behavior.listenTo( settings, 'change', this.saveHistory );
	},
};

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

	settings( settings ) {
		this.getSelection().forEach( ( element ) => element.model.get( 'settings' ).set( settings ) );

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

			newElements.push( $eElement.create( [ model.elType, model.widgetType ], model.settings, args ) );
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
		const elements = this.getSelection().concat( $eElement.context );

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

		if ( 'undefined' === typeof selector ) {
			this.context = [ elementor.getPreviewView() ];
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
