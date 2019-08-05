import eQuery from './e-query';
import Settings from './settings';
import Selection from './selection';
import Elements from './elements/elements';

export default class Document extends elementorModules.Module {
	constructor( args ) {
		super( args );

		args.document = this;

		this.type = args.type;

		this.elements = new Elements( args );

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

						// Get settings and etc.
						if ( 'object' === typeof results && ! _.isArray( results ) ) {
							return results;
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
