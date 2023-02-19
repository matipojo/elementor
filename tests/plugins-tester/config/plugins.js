import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

const topPluginsConfig = JSON.parse( fs.readFileSync( __dirname + '/top-plugins.json' ) );

const notCompatiblePlugins = [
	'complianz-gdpr', // SQL Error
	'easy-table-of-contents', // A welcome page replaces the editor.
	'elementor-beta', // Enables container experiment and panel badge.
	'embedpress',
	'essential-addons-for-elementor-lite',
	'flexible-elementor-panel',
	'happy-elementor-addons',
	'paid-memberships-pro', // A welcome page replaces the editor.
	'qi-addons-for-elementor',
	'scroll-magic-addon-for-elementor',
	'sina-extension-for-elementor',
	'the-post-grid',
	'woolentor-addons',
];

const pluginsToTest = topPluginsConfig.filter( ( plugin ) => ! notCompatiblePlugins.includes( plugin ) );

export default pluginsToTest;
