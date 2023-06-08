import { Button, Drawer, TextField } from '@elementor/ui';
import { useState } from 'react';

export default function PromptModal( { open, onClose } ) {
	const [ loading, setLoading ] = useState( false );

	const submit = ( event ) => {
		event.preventDefault();

		setLoading( true );
		// Send the request to the server.
		setTimeout( () => {
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
				<TextField sx={ { width: '100%' } } />
				<Button variant="contained" type="submit" disabled={ loading }>
					Generate
				</Button>
			</form>
		</Drawer>
	);
}
