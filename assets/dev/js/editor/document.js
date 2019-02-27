class Elements extends elementorModules.Module {
	constructor( args ) {
		super( ...args );

		this.document = args.document;
		this.elements = args.elements;
	}

	select() {
		return this.document.selection;
	}

	getById( id ) {
		const findRecursive = function( elements ) {
			const element = elements.filter( function( model ) {
				if ( id === model.get( 'id' ) ) {
					return model;
				}

				if ( model.get( 'elements' ) ) {
					return findRecursive( model.get( 'elements' ).models );
				}
			} );

			return element;
		};

		const model = findRecursive( this.elements );

		if ( ! model ) {
			throw Error( 'Can\'t find model #' + id );
		}

		return elementor.sections.currentView.children.findByModel( model );
	}

	addSection( columns = 1, settings, args ) {
		// Temp: decrease columns because the editor adds one automatically.
		columns--;

		this.add( 'section', settings, args );

		const section = this.getSelected();

		for ( let i = 0; i < columns; i++ ) {
			this.addColumn();
		}

		// Keep the section as current element instead of the column.
		this[ 0 ] = section;

		return this;
	}

	addColumn( settings, args ) {
		this.add( 'column', settings, args );

		this[ 0 ] = this.getSelected();

		return this;
	}

	addWidget( type, settings, args ) {
		this.add( [ 'widget', type ], settings, args );

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

		this.add( type, settings, args );

		return this;
	}

	add( type, settings, args = {} ) {
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

		if ( ! args.at ) {
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

		return this;
	}

	update( settings ) {
		const element = this.getSelected();

		element.get( 'settings' ).set( settings );

		return this;
	}

	duplicate( element ) {
		const duplicatedElement = this.add( element.type, element.settings, element.getPosition() );

		return duplicatedElement;
	}

	copy( element ) {
		elementorCommon.commands.run( 'editor/clipboard/copy', {
			element: element,
		} );
	}

	move( targetElement, args = {} ) {
		const element = this.getSelected();

		targetElement.addChildElement( element.model.clone(), {
			at: args.at,
			trigger: {
				beforeAdd: 'drag:before:update',
				afterAdd: 'drag:after:update',
			},
			onBeforeAdd: function() {
				element._isRendering = true;
				element.collection.remove( element.model );
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
			return this.add( element );
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

export default class Document extends elementorModules.Module {
	constructor( args ) {
		super( ...args );

		args.document = this;

		this.type = args.type;
		this.elements = new Elements( args );
		this.settings = new Settings( args );
		this.selection = new Selection( args );

		this.status = 'saved';

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
}

window.$e = function( selector ) {
	return elementor.getDocument().get( selector );
};

class Test extends elementorModules.Module {
	constructor( ...args ) {
		super( ...args );

		const section = elementor.getDocument().elements.add( 'section', {}, {
				at: 1,
			} ).getSelected(),
			heading = elementor.getDocument().elements.add( [ 'widget', 'heading' ], {
				title: 'Hi, I\'m an Heading',
			}, {
				toElement: section.children.findByIndex( 0 ),
				at: 1,
			} ).getSelected();

		$e().addSection( 1, {
			background_background: 'classic',
			background_color: '#7a7a7a',
		} ).useSelected().addWidget( 'heading' );

		$e().useSelected().update( {
			background_type: 'color',
			background_color: '#490049',
		} );

		$e( '3786d77' ).update( {
			background_type: 'color',
			background_color: '#000049',
		} );

		$e( section ).update( {
			background_type: 'color',
			background_color: '#000049',
		} );

		$e( heading ).update( {
			title: 'Hi, I\'m a changed Heading',
			text_color: '#ffffff',
		} );

		const heading2 = $e( document ).add( 'heading', {
			title: 'Second Heading',
		}, {
			at: 1,
		} );

		const heading3 = $e( section ).add( 'heading', {
			title: 'Second Heading',
		}, {
			at: 1,
		} );

		/////////////////////////////////////////////////////////////////////

		$e( heading ).appendTo( section );

		document.elements.move( heading2, {
			element: section.elements.get( 2 ),
			at: 1,
		} );

		document.selection
			.add( heading )
			.add( heading2 )
			.add( section.elements.get( 2 ) )
			.copy()
			.reset()
			.add( section )
			.paste()
			.resetStyle();

		document.elements.pasteStyle( heading2 );

		document.elements.remove( heading2 );

		document.elements.remove( section.elements.get( 2 ).elements.get( 1 ) );

		document.save();
	}
}
