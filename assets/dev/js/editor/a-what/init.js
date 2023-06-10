import AWhatComponent from './e-component/component';
import { listenTo, v1ReadyEvent } from '@elementor/editor-v1-adapters';
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

	injectIntoTop( {
		id: 'a-what-buttons',
		filler: Main,
	} );
}
