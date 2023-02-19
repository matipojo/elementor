import { execSync } from 'child_process';
import fetch from 'node-fetch';

export class PluginsTester {
	options = {
		runServer: true,
		debug: false,
		pluginsToTest: [],
		cwd: '',
		logger: null,
	};

	constructor( options ) {
		Object.assign( this.options, options );

		this.run();
	}

	async run() {
		this.setCwd();

		this.checkPlugins();
	}

	cmd( cmd ) {
		this.options.logger.info( 'cmd', cmd );

		return execSync( cmd ).toString();
	}

	runWP( cmd ) {
		if ( ! this.options.runServer ) {
			return this.cmd( `cd ../../ && ${ cmd }` );
		}
		return this.cmd( cmd );
	}

	checkPlugins() {
		const errors = [];
		this.options.pluginsToTest.forEach( ( slug ) => {
			// This.runWP( `npx wp-env run cli wp plugin install ${ slug } --activate` );

			// install wp plugin via rest
			let pluginInfo;
			fetch( 'http://localhost:7777/wp-json/wp/v2/plugins', {
				method: 'POST',
				body: JSON.stringify( {
					slug,
					status: 'active',
				} ),
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': 'e2e-tests',
				},
			} ).then( ( response ) => {
				pluginInfo = response;
				console.log( response );
 			} );

			try {
				this.cmd( `node ./scripts/run-backstop.js --slug=${ slug } --diffThreshold=${ this.options.diffThreshold }` );
			} catch ( error ) {
				this.options.logger.error( error );
				errors.push( {
					slug,
					error,
				} );
			}

			// This.runWP( `npx wp-env run cli wp plugin deactivate ${ slug }` );

			// install wp plugin via rest api
			fetch( 'http://localhost:7777/wp-json/wp/v2/plugins/' + pluginInfo.plugin, {
				method: 'POST',
				body: JSON.stringify( {
					status: 'inactive',
				} ),
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': 'e2e-tests',
				},
			} ).then( ( response ) => {
				console.log( response );
			} );
		} );

		if ( errors.length ) {
			const failedPlugins = errors.map( ( { slug } ) => slug );

			this.cmd( `mkdir -p errors-reports` );

			failedPlugins.forEach( ( { slug } ) => {
				this.cmd( `mv reports/${ slug } errors-reports/${ slug }` );
			} );

			this.options.logger.error( { failedPlugins } );

			process.exit( 1 );
		}
	}

	setCwd() {
		this.cmd( `cd ${ this.options.cwd }` );
	}
}
