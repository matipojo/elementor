export default class eQuery {
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

	getIndex( index ) {
		const element = this.context[ index ];
		return $e( '', element );
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
