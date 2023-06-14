import AWhatComponent from './e-component/component';
import { listenTo, v1ReadyEvent, routeOpenEvent, routeCloseEvent, registerRoute, openRoute, windowEvent } from '@elementor/editor-v1-adapters';
import { injectIntoTop } from '@elementor/editor';
import { registerSlice } from '@elementor/store';
import { slice } from './store';
import Main from './components/main';
import { Parser } from './parser/parser';
import { validateEnv } from './env';

export default function init() {
	validateEnv();

	registerSlice( slice );

	listenTo(
		v1ReadyEvent(),
		() => $e.components.register( new AWhatComponent() ),
	);

	listenTo(
		v1ReadyEvent(),
		() => window.elementor.html4Parser = new Parser(),
	);

	listenTo(
		windowEvent( 'elementor/panel/init' ),
		() => {
			registerRoute( 'panel/no-panel' );
		},
	);

	let beenThere = false;

	listenTo(
		routeOpenEvent( 'panel/elements/categories' ),
		() => {
			if ( ! beenThere ) {
				openRoute( 'panel/no-panel' );

				beenThere = true;
			}
		},
	);

	listenTo(
		routeOpenEvent( 'panel/no-panel' ),
		() => {
			document.getElementById( 'elementor-preview' ).style.width = '100%';
			document.getElementById( 'elementor-preview' ).style.transition = 'none';
			document.getElementById( 'elementor-panel' ).style.display = 'none';
		},
	);

	listenTo(
		routeCloseEvent( 'panel/no-panel' ),
		() => {
			document.getElementById( 'elementor-preview' ).style.width = 'var(--e-preview-width)';
			document.getElementById( 'elementor-panel' ).style.display = 'block';
		},
	);

	injectIntoTop( {
		id: 'a-what-buttons',
		filler: Main,
	} );
}
