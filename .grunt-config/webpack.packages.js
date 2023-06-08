const path = require( 'path' );
const fs = require( 'fs' );
const { GenerateWordPressAssetFileWebpackPlugin } = require( '@elementor/generate-wordpress-asset-file-webpack-plugin' );
const { ExtractI18nWordpressExpressionsWebpackPlugin } = require( '@elementor/extract-i18n-wordpress-experssions-webpack-plugin' );
const { ExternalizeWordPressAssetsWebpackPlugin } = require( '@elementor/externalize-wordpress-assets-webpack-plugin' );

const { dependencies } = require( '../package.json' );

const packages = Object.keys( dependencies )
	.filter( ( packageName ) => packageName.startsWith( '@elementor/' ) )
	.map( ( packageName ) => {
	   const pkgJSON = fs.readFileSync( path.resolve( __dirname, `../node_modules/${packageName}/package.json` ) );

	   const { main, module, elementor } = JSON.parse( pkgJSON );

	   return {
	       mainFile: module || main,
	       packageName,
	       type: elementor?.type || 'util',
	   }
	} )
	.filter( ( { mainFile } ) => !! mainFile )
	.map( ( { mainFile, packageName, type } ) => {
	   return {
	       packageName,
	       type,
	       name: packageName.replace( '@elementor/', '' ),
	       path: path.resolve( __dirname, `../node_modules/${ packageName }`, mainFile ),
	   }
	} );

packages.push({
	packageName: '@elementor/a-what',
	type: 'extension',
	name: 'a-what',
	path: path.resolve( __dirname, '../assets/dev/js/editor/a-what/index.js' ),
})

const common = {
	name: 'packages',
	entry: Object.fromEntries(
		packages.map( ( { name, path } ) => [ name, path ] )
	),
	plugins: [
		new GenerateWordPressAssetFileWebpackPlugin( {
			handlePrefix: 'elementor-packages-',
			apps: packages.filter( ( entry ) => 'app' === entry.type ).map( ( entry ) => entry.name ),
			extensions: packages.filter( ( entry ) => 'extension' === entry.type ).map( ( entry ) => entry.name ),
			i18n: {
				domain: 'elementor',

			},
		} ),
		new ExternalizeWordPressAssetsWebpackPlugin( { globalKey: '__UNSTABLE__elementorPackages' } ),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [ '@wordpress/default' ],
							plugins: [
								[ '@wordpress/babel-plugin-import-jsx-pragma' ],
								[ '@babel/plugin-transform-react-jsx', {
									'pragmaFrag': 'React.Fragment',
								} ],
								[ '@babel/plugin-transform-runtime' ],
								[ '@babel/plugin-transform-modules-commonjs' ],
							],
						},
					},
				],
			},
		],
	},
	output: {
		path: path.resolve( __dirname, '../assets/js/packages/' ),
	},
}

const devConfig = {
	...common,
	mode: 'development',
	devtool: false, // TODO: Need to check what to do with source maps.
	watch: true, // All the webpack config in the plugin that are dev, should have this property.
	output: {
		...( common.output || {} ),
		filename: '[name].js',
	}
}

const prodConfig = {
	...common,
	mode: 'production',
	devtool: false, // TODO: Need to check what to do with source maps.
	optimization: {
		...( common.optimization || {} ),
		minimize: true,
	},
	plugins: [
		...( common.plugins || [] ),
		new ExtractI18nWordpressExpressionsWebpackPlugin(),
	],
	output: {
		...( common.output || {} ),
		filename: '[name].min.js',
	}
}

module.exports = {
	dev: devConfig,
	prod: prodConfig,
};
