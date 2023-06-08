import AWhatComponent from './component';
import { listenTo, v1ReadyEvent } from '@elementor/editor-v1-adapters';
import { injectIntoTop } from '@elementor/editor';
// Import { registerSlice } from '@elementor/store';
import Main from './components/main';

export default function init() {
	// RegisterSlice();

	listenTo(
		v1ReadyEvent(),
		() => $e.components.register( new AWhatComponent() ),
	);

	injectIntoTop( {
		id: 'a-what-buttons',
		filler: Main,
	} );
}
