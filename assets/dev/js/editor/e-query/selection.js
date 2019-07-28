export default class Selection {
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
