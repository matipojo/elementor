class Elements extends elementorModules.Module {
	constructor( args ) {
		super( ...args );

		this.document = args.document;
		this.elements = args.elements;

		this.registerCommands();
	}

	registerCommands() {
		elementorCommon.commands.register( 'document/elements/addSection', ( settings, at ) => {
			return this.addSection( settings, at );
		} );

		elementorCommon.commands.register( 'document/elements/reset', () => {
			return this.reset();
		} );

		elementorCommon.commands.register( 'document/elements/add', ( element ) => {
			return this.add( element );
		} );
	}

	addSection( columns = 1, settings = {}, at = null ) {
		this.add( 'section', settings, {
			at: at,
		} );

		for ( let i = 0; i < columns; i++ ) {
			this.addColumn();
		}

		return this;
	}

	addColumn( settings = {}, at = null ) {
		this.add( 'column', settings, {
			at: at,
		} );

		return this;
	}

	addWidget( type, settings, at = null ) {
		this.add( [ 'widget', type ], settings, {
			at: at,
		} );

		return this;
	}

	add( type, settings, position = {} ) {
		let targetElement;

		if ( position.element ) {
			targetElement = this.elements.find( position.element );
		} else if ( this.document.selection.get().length ) {
			const selection = this.document.selection.get();
			targetElement = selection[ 0 ];
		} else {
			targetElement = elementor.getPreviewView();
		}

		if ( ! targetElement ) {
			throw Error( 'Empty target element.' );
		}

		if ( ! position.at ) {
			position.at = targetElement.children.length + 1;
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
			at: position.at,
		} );

		this.document.selection.set( newElement );

		return this;
	}

	update( element, settings ) {
		const updatedElement = elementorCommon.commands.run( 'document/elements/update', {
			element: element,
			settings: settings,
		} );

		return updatedElement;
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

	move( element, to ) {
		const updatedElement = elementorCommon.commands.run( 'document/elements/move', {
			element: element,
			to: to,
		} );

		return updatedElement;
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

	registerCommands() {
	}
}

class Test extends elementorModules.Module {
	constructor( ...args ) {
		super( ...args );

		const document = elementor.getDocument(),
			section = document.elements.add( 'section', {
				columns: 2,
			}, {
				at: 1,
			} ),
			heading = document.elements.add( 'heading', {
				title: 'Hi, I\'m an Heading',
			}, {
				element: section.elements.get( 2 ),
				at: 1,
			} );

		document.elements.update( section, {
			background_type: 'color',
			background: {
				color: '#494949',
			},
		} );

		document.elements.update( heading, {
			title: 'Hi, I\'m a changed Heading',
			text_color: '#ffffff',
		} );

		const heading2 = document.elements.add( 'heading', {
			title: 'Second Heading',
		}, {
			element: section.elements.get( 2 ),
			at: 1,
		} );

		document.elements.move( section.elements.get( 2 ), {
			element: section,
			at: 1,
		} );


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
