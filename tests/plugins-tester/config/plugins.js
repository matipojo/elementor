import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

const topPluginsConfig = JSON.parse( fs.readFileSync( __dirname + '/top-plugins.json', 'utf8' ) );

const notCompatiblePlugins = [
	'embedpress',
	'flexible-elementor-panel',
	'happy-elementor-addons',
	'qi-addons-for-elementor',
	'scroll-magic-addon-for-elementor',
	'sina-extension-for-elementor',
	'the-post-grid',
];

const pluginsToTest = topPluginsConfig.filter( ( plugin ) => ! notCompatiblePlugins.includes( plugin ) );

export default pluginsToTest;
