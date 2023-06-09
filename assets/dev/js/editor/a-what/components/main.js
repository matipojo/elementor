import NewPromptButton from './new-prompt-button';
import { useState } from 'react';
import PromptModal from './prompt-modal';
import { useSelector } from '@elementor/store';
import { selectElementsIds } from '../store';
import ExistingPromptButton from './existing-prompt-button';

export default function Main() {
	const [ open, setOpen ] = useState( false );
	const elementsIds = useSelector( selectElementsIds );

	return <>
		<PromptModal open={ open } onClose={ () => setOpen( false ) } />
		<NewPromptButton onClick={ () => setOpen( ( prevState ) => ! prevState ) } />
		{ elementsIds.map( ( elementId ) => <ExistingPromptButton key={ elementId } elementId={ elementId } /> ) }
	</>;
}
