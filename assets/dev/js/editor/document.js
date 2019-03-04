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

	moveTo( args, target ) {
		let title;

		if ( 1 === target.getSelection().length ) {
			const model = target.getSelection()[ 0 ].model;
			title = this.getModelLabel( [ model.get( 'elType' ), model.get( 'widgetType' ) ] );
		} else {
			title = 'Elements';
		}

		elementor.history.history.startItem( {
			type: 'move',
			title: title,
		} );
	},
};

class Elements {
	constructor( data ) {
		this.document = data.document;
		this.elements = data.elements;
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

	findViewRecursive( parent, id ) {
		for ( let x in parent._views ) {
			let view = parent._views[ x ];

			if ( id === view.model.id ) {
				return view;
			}

			if ( view.children ) {
				view = this.findViewRecursive( view.children, id );
				if ( view ) {
					return view;
				}
			}
		}

		return false;
	}

	getById( id ) {
		const view = this.findViewRecursive( elementor.sections.currentView.children, id );

		if ( ! view ) {
			throw Error( 'Can\'t find view #' + id );
		}

		return view;
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

		if ( type[ 1 ] ) {
			// TODO: widgetType => subType.
			element.widgetType = type[ 1 ];
		}

		const newElements = [];

		this.getSelection().forEach( ( targetElement ) => {
			// Check typeof because at can be 0.
			const at = 'number' === typeof args.at ? args.at : targetElement.children.length + 1;
			newElements.push( targetElement.addChildElement( element, { at: at } ) );
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
			// $eElement.context[ 0 ], currently support move once only.
			newElements.push( $eElement.context[ 0 ].addChildElement( element.model.toJSON(), {
				at: args.at,
				onBeforeAdd: () => {
					element._isRendering = true;
					element._parent.collection.remove( element.model );
				},
			} ) );
		} );

		return $e( '', newElements );
	}

	duplicate() {
		const newElements = [];

		this.getSelection().forEach( ( element ) => {
			const parent = $e( '', element._parent ),
				model = element.model.attributes;

			newElements.push( parent.create( [ model.elType, model.widgetType ], model.settings, {
				at: parent.context.collection.indexOf( element.model ) + 1,
			} ) );
		} );

		return newElements;
	}

	copy() {
		const models = this.getSelection().map( ( element ) => element.model );

		elementorCommon.storage.set( 'clipboard', models );
	}

	paste() {
		const clipboardModels = elementorCommon.storage.get( 'clipboard' ),
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

				newElements.push( element.addChildElement( model, { at: index, clone: true } ) );
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
			this.context = elementor.getDocument().elements.getById( selector.replace( '#', '' ) );
		} else {
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
		$e().create( 'section' );

		// Create a section with settings.
		$e().create( 'section', {
			background_background: 'classic',
			background_color: '#7a7a7a',
		} );

		// Create a section in a specific position.
		$e().create( 'section', {}, {
			at: 0,
		} );

		$e( '#akjxzk' ).moveTo( $e( '#bccdsd' ) );

		// Create a section and add a widget.
		$e().create( 'section' ).create( 'column' ).create( [ 'widget', 'heading' ] );

		// Separated actions.
		let $eSection = $e().create( 'section' ),
			$eColumn2 = $eSection.create( 'column' ),
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
		$eHeading.moveTo( $eColumn3, 0 );

		// Drag from panel.
		let $eVideo = $eColumn3.create( [ 'widget', 'video' ] );

		/////////////////////////////////////////////////

		// Copy elements.
		$eHeading.add( $eVideo ).copy();

		// Paste.
		$eColumn2.paste();

		// Remove.
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
