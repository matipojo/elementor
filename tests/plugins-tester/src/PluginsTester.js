import { execSync } from 'child_process';

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
		if ( this.options.runServer ) {
			this.setCwd();
			this.runServer();
		}

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
			this.runWP( `npx wp-env run cli wp plugin install ${ slug } --activate` );

			try {
				this.cmd( `node ./scripts/run-backstop.js --slug=${ slug } --diffThreshold=${ this.options.diffThreshold }` );
			} catch ( error ) {
				this.options.logger.error( error );
				errors.push( {
					slug,
					error,
				} );
			}

			this.runWP( `npx wp-env run cli wp plugin deactivate ${ slug }` );
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

	runServer() {
		if ( process.env.CI ) {
			this.cmd( '   npm run wp-env start' );
		} else {
			this.prepareTestSite();
		}
	}

	setCwd() {
		this.cmd( `cd ${ this.options.cwd }` );
	}

	prepareTestSite() {
		this.cmd( 'bash ./scripts/prepare-local-test.sh' );
	}
}
