import GenerateWithAiButton from './generate-with-ai-button';
import { useState } from 'react';
import PromptModal from './prompt-modal';

export default function Main() {
	const [ open, setOpen ] = useState( false );

	return <>
		<PromptModal open={ open } onClose={ () => setOpen( false ) } />
		<GenerateWithAiButton onClick={ () => setOpen( ( prevState ) => ! prevState ) } />
	</>;
}
