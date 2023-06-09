import { Box, Button, Divider, Drawer, TextField, Typography } from '@elementor/ui';
import { useDispatch, useSelector } from '@elementor/store';
import { useState } from 'react';
import { selectElementResults, slice } from '../store';

export default function PromptModal( { open, onClose } ) {
	const [ loading, setLoading ] = useState( false );
	const dispatch = useDispatch();
	const [ elementId, setElementId ] = useState( '' );

	const results = useSelector( ( state ) => selectElementResults( state, elementId ) );

	const submit = ( event ) => {
		event.preventDefault();

		setLoading( true );

		// TODO
		// 1. Send the request to the server
		// 2. Get the response and parse it
		// 3. Pass it the the "push" action

		setTimeout( () => {
			const prompt = event.target.prompt.value;
			const aiPromptResult = `<row><text>${ prompt }</text></row>`;

			const { content: [ element ] } = window.elementor.html4Parser.parse(
				aiPromptResult,
				elementId || null,
			);

			console.log( 'Element ID: ' + element.id );

			dispatch( slice.actions.push( {
				elementId: element.id,
				prompt,
				result: JSON.stringify( element ),
			} ) );

			setLoading( false );
			event.target.prompt.value = '';
		}, 1500 );
	};

	const undo = () => {
		dispatch( slice.actions.undo( { elementId } ) );
	};

	const redo = () => {
		dispatch( slice.actions.redo( { elementId } ) );
	};

	return (
		<Drawer
			anchor="bottom"
			open={ open }
			onClose={ onClose }
		>
			<Box sx={ { padding: '20px' } }>
				<Typography variant="body2"> Debug: </Typography>
				<TextField
					label="Element ID"
					value={ elementId }
					onChange={ ( e ) => setElementId( e.target.value ) }
					sx={ { marginTop: '10px' } }
				/>
				<Divider sx={ { marginTop: '20px' } } />
			</Box>
			<form onSubmit={ submit } style={ { padding: '20px', display: 'flex' } }>
				<Button disabled={ 0 === results.past.length } onClick={ undo }>Undo</Button>
				<Button disabled={ 0 === results.future.length } onClick={ redo }>Redo</Button>
				<TextField
					sx={ { width: '100%' } }
					name="prompt"
					defaultValue={ results.current?.nextPrompt || '' }
					key={ results.current?.nextPrompt || '__EMPTY__' }
				/>
				<Button variant="contained" type="submit" disabled={ loading }>
					{ results.current?.nextPrompt ? 'Regenerate' : 'Generate' }
				</Button>
			</form>
		</Drawer>
	);
}
