var History = {
	get( target, propKey ) {
		if ( ! target[ propKey ] ) {
			return;
		}

		const origMethod = target[ propKey ];
		return ( ...args ) => {
			let result = origMethod.apply( target, args );
			// console.log( propKey );
			if ( this[ propKey ] ) {
				this[ propKey ].apply( this, args );
			}

			return result;
		};
	},
	create: function( obj, prop ) {
		console.log( 'add' );
	},
};

class Elements extends elementorModules.Module {
	constructor( data ) {
		super( data );

		this.document = data.document;
		this.elements = data.elements;
	}

	select() {
		return this.document.selection;
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

	createSection( columns = 1, settings, args ) {
		// Temp: decrease columns because the editor adds one automatically.
		columns--;

		this.create( 'section', settings, args );

		const section = this.getSelected();

		for ( let i = 0; i < columns; i++ ) {
			this.createColumn();
		}

		// Keep the section as current element instead of the column.
		this[ 0 ] = section;

		return this;
	}

	createColumn( settings, args ) {
		this.create( 'column', settings, args );

		this[ 0 ] = this.getSelected();

		return this;
	}

	createWidget( type, settings, args ) {
		this.create( [ 'widget', type ], settings, args );

		this[ 0 ] = this.getSelected();

		return this;
	}

	getSelected() {
		const selection = this.document.selection.get();

		if ( ! selection.length ) {
			throw Error( 'No Selected Element.' );
		}

		return selection[ 0 ];
	}

	useSelected() {
		this.selected = this.getSelected();
		this[ 0 ] = this.selected;

		return this;
	}

	addToSelected( type, settings, args ) {
		const selection = this.document.selection.get();

		if ( ! selection.length ) {
			throw Error( 'No Selected Element.' );
		}

		args.toElement = selection[ 0 ];

		this.create( type, settings, args );

		return this;
	}

	create( type, settings, args = {} ) {
		let targetElement;

		if ( args.targetElement ) {
			targetElement = args.targetElement;
		} else if ( this.selected ) {
			targetElement = this.selected;
			this.selected = null;
		} else {
			targetElement = elementor.getPreviewView();
		}

		if ( ! targetElement ) {
			throw Error( 'Empty target element.' );
		}

		if ( 'undefined' === typeof args.at ) {
			args.at = targetElement.children.length + 1;
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

		const newElement = targetElement.addChildElement( element, {
			at: args.at,
		} );

		this.document.selection.set( newElement );

		this.document.lastCreated = newElement;

		return newElement;
	}

	update( settings ) {
		const element = this.getSelected();

		element.get( 'settings' ).set( settings );

		return this;
	}

	duplicate( element ) {
		const duplicatedElement = this.create( element.type, element.settings, element.getPosition() );

		return duplicatedElement;
	}

	copy( element ) {
		elementorCommon.commands.run( 'editor/clipboard/copy', {
			element: element,
		} );
	}

	move( targetElement, args = {} ) {
		const element = this.getSelected();

		targetElement.addChildElement( element.model.toJSON(), {
			at: args.at,
			trigger: {
				beforeAdd: 'drag:before:update',
				afterAdd: 'drag:after:update',
			},
			onBeforeAdd: function() {
				element._isRendering = true;
				element._parent.collection.remove( element.model );
			},
		} );

		return this;
	}

	remove( element ) {
		const parent = elementorCommon.commands.run( 'document/elements/remove', {
			element: element,
		} );

		return parent;
	}

	paste( element ) {
		const pastedElement = elementorCommon.commands.run( 'document/elements/paste', {
			element: element,
		} );

		return pastedElement;
	}

	pasteStyle( element ) {
		const updatedElement = elementorCommon.commands.run( 'document/elements/pasteStyle', {
			element: element,
		} );

		return updatedElement;
	}

	resetStyle( element ) {
		const updatedElement = elementorCommon.commands.run( 'document/elements/resetStyle', {
			element: element,
		} );

		return updatedElement;
	}
}

class Selection extends elementorModules.Module {
	constructor( args ) {
		super( ...args );

		this.document = args.document;
		this.elements = [];

		this.registerCommands();
	}

	registerCommands() {
		elementorCommon.commands.register( 'document/selection/get', () => {
			return this.get();
		} );

		elementorCommon.commands.register( 'document/selection/reset', () => {
			return this.reset();
		} );

		elementorCommon.commands.register( 'document/selection/add', ( element ) => {
			return this.create( element );
		} );
	}

	children() {
		const children = this.get()[ 0 ].children;
		this.set( children );

		return this;
	}

	first() {
		const element = this.children().getSelected()[ 0 ];
		this.set( element );

		return this;
	}

	last() {
		const element = this.get()[ 0 ].children.last();
		this.set( element );

		return this;
	}

	get() {
		return this.elements;
	}

	set( element ) {
		this.reset().add( element );

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
		elementorCommon.commands.run( 'document/selection/addMultiple', {
			elements: elements,
		} );

		return this;
	}

	addRange( element, fromIndex, toIndex ) {
		elementorCommon.commands.run( 'document/selection/addRange', {
			element: element,
			fromIndex: fromIndex,
			toIndex: toIndex,
		} );

		return this;
	}

	update( settings ) {
		elementorCommon.commands.run( 'document/selection/update', {
			settings: settings,
		} );

		return this;
	}

	duplicate() {
		const duplicatedElements = elementorCommon.commands.run( 'document/selection/duplicate' );

		this.reset().addMultiple( duplicatedElements );

		return this;
	}

	move( to ) {
		const selectedElements = elementorCommon.commands.run( 'document/selection/get' );

		elementorCommon.commands.run( 'document/selection/move', {
			elements: selectedElements,
			to: to,
		} );

		return this;
	}

	remove() {
		const selectedElements = elementorCommon.commands.run( 'document/selection/get' );

		elementorCommon.commands.run( 'document/selection/remove', {
			elements: selectedElements,
		} );

		return this;
	}

	copy() {
		const selectedElements = elementorCommon.commands.run( 'document/selection/get' );

		elementorCommon.commands.run( 'document/clipboard/add', {
			elements: selectedElements,
		} );

		return this;
	}

	paste( to ) {
		const copiedElements = elementorCommon.commands.run( 'document/clipboard/get' );

		elementorCommon.commands.run( 'document/selection/paste', {
			elements: copiedElements,
			to: to,
		} );

		return this;
	}

	pasteStyle() {
		elementorCommon.commands.run( 'document/selection/pasteStyle', {
			from: elementorCommon.commands.run( 'document/clipboard/get' ),
			to: elementorCommon.commands.run( 'document/selection/get' ),
		} );

		return this;
	}

	resetStyle() {
		elementorCommon.commands.run( 'document/selection/resetStyle' );

		return this;
	}
}

class Settings extends elementorModules.Module {
	constructor( args ) {
		super( ...args );

		this.settings = args.settings;
	}
}

class eQuery {
	constructor( selector ) {
		this.selector = selector;
		// this.context = elementor.getDocument().get( selector );
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

		this.registerCommands();
	}

	get( selector ) {
		let element;

		if ( ! selector || document === selector ) {
			element = this.elements.elements;
		} else if ( 'string' === typeof selector ) {
			element = this.elements.getById( selector );
		} else {
			element = selector;
		}

		this.selection.set( element );
		return this.elements.useSelected();
	}

	registerCommands() {
	}

	registerEQuery() {
		const self = this;

		window.$e = function( selector ) {
			return new Proxy( new eQuery( selector ), {
				get( target, propKey ) {
					console.log( propKey );
					return ( ...args ) => {
						console.log( args );
						if ( self.elements[ propKey ] ) {
							if ( this.context ) {
								self.selection.set( this.context );
								self.elements.useSelected();
							}

							this.context = self.elements[ propKey ].apply( self.elements, args );
							return this;
						}
					};
				},
			} );
		};
	}
}

class Test extends elementorModules.Module {
	constructor( ...args ) {
		super( ...args );

// Create a section at end of document.
		$e().create( 'section' );

// Create a section with settings.
		$e().create( 'section', {
			background: {
				type: 'classic',
				color: '#7a7a7a',
			},
		} );

// Create a section in a specific position.
		$e().create( 'section', {}, {
			at: 0,
		} );

// Create a section and add a widget.
		$e().create( 'section' ).create( 'column' ).create( [ 'widget', 'heading' ] );

// Separated actions.
		const $eColumn = $e().create( 'section' ).create( 'column' ),
			$eHeading = $eColumn.create( [ 'widget', 'heading' ], {
				title: 'Hi, I\'m an Heading',
			} );

// Add a widget at top of the column.
		$eColumn.create( [ 'widget', 'button' ],
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
		$e( '#3786d77' ).settings( {
			background: {
				type: 'image',
				id: 123,
			},
		} );

// Move widget.
		$eHeading.moveTo( $eColumn, 0 );

// Drag from panel.
		const draggedWidgetType = 'video',
			$eTarget = $e( '#nj4fksj' ),
			$eVideo = $eTarget.create( draggedWidgetType );

// Copy elements.
		$eHeading.add( $eVideo ).copy();

// Create another column.
		const $eColumn2 = $eColumn.parent().create( 'column' );

// Paste.
		$eColumn2.paste();

// Remove.
		$eVideo.remove();

// Paste Style.
		$eHeading.copy();
		$eColumn2.find( 'heading' ).pasteStyle();

// Paste Style directly.
		$eColumn2.find( 'heading' ).pasteStyle( $eHeading );

		$e.save();
	}
}
