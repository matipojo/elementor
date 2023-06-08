import AWhatComponent from './component';
import { listenTo, v1ReadyEvent } from '@elementor/editor-v1-adapters';
import { injectIntoTop } from '@elementor/editor';
import GenerateWithAiButton from './components/generate-with-ai-button';

export default function init() {
	listenTo(
		v1ReadyEvent(),
		() => $e.components.register( new AWhatComponent() ),
	);

	injectIntoTop( {
		id: 'a-what-buttons',
		filler: GenerateWithAiButton,
	} );
}
