import { Button, Drawer, TextField } from '@elementor/ui';
import { useDispatch } from '@elementor/store';
import { useState } from 'react';
import { slice } from '../store';

export default function PromptModal( { open, onClose } ) {
	const [ loading, setLoading ] = useState( false );
	const dispatch = useDispatch();

	const submit = ( event ) => {
		event.preventDefault();

		setLoading( true );
		// Send the request to the server.
		setTimeout( () => {
			const result = '<row><image>Pikachu<image><row>';

			const [ container ] = window.elementor.html4Parser.import( result );

			dispatch( slice.actions.addResult( {
				id: container.id,
				prompt: event.target.prompt.value,
				result,
			} ) );

			setLoading( false );
			onClose();
		}, 1500 );
	};

	return (
		<Drawer
			anchor="bottom"
			open={ open }
			onClose={ onClose }
		>
			<form onSubmit={ submit } style={ { padding: '20px', display: 'flex' } }>
				<TextField sx={ { width: '100%' } } name="prompt" />
				<Button variant="contained" type="submit" disabled={ loading }>
					Generate
				</Button>
			</form>
		</Drawer>
	);
}
