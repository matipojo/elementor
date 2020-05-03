import CommandData from 'elementor-api/modules/command-data';

// Nothing todo
export class Index extends CommandData {
	validateArgs( args = {} ) {
		const { query = {} } = args;

		this.requireArgumentConstructor( 'routes', Object, query );
	}

	applyBeforeGet( args ) {
		const { query = {}, options = {} } = args,
			newRoutes = [];

		/*
		Excepted format:

		await $e.data.get( 'bulk/index', {
		    routes: {
		        globals: 'globals/index',
		        elements: $e.data.commandToEndpoint( 'GET', 'document/elements', {
		           query: { document_id: 4123},
		        } )
		    }
		} );
		 */

		// Re-format routes, this is excepted by backend endpoint.
		Object.entries( query.routes ).forEach( ( [ routeKey, routeValue ] ) => {
			newRoutes.push( routeKey + ':' + routeValue );
		} );

		query.routes = newRoutes;

		// TODO: How to handle cache situation in bulk?, for now always fresh data.
		//options.refresh = true;

		args.query = query;
		args.options = options;

		return args;
	}
}
