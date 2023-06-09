import { Box, Button, Divider, Drawer, TextField, Typography } from '@elementor/ui';
import { useDispatch, useSelector } from '@elementor/store';
import { useState } from 'react';
import { selectElementResults, selectStatus, slice } from '../store';

export default function PromptModal( { open, onClose } ) {
	const [ debugElementId, setDebugElementId ] = useState( '' );

	const dispatch = useDispatch();
	const results = useSelector( ( state ) => selectElementResults( state, debugElementId ) );
	const status = useSelector( selectStatus );

	const submit = async ( { prompt, elementId } ) => {
		elementId = elementId || elementorCommon.helpers.getUniqueId();

		dispatch( slice.actions.start( { elementId, prompt } ) );

		// TODO
		// 1. Send the request to the server
		// 2. Get the response and parse it
		// 3. Pass it the the "push" action
		const result = await send( { prompt, elementId } );

		dispatch( slice.actions.end( {
			elementId: result.id,
			result: JSON.stringify( result ),
		} ) );
	};

	const undo = ( { elementId } ) => dispatch( slice.actions.undo( { elementId } ) );
	const redo = ( { elementId } ) => dispatch( slice.actions.redo( { elementId } ) );

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
					value={ debugElementId }
					onChange={ ( e ) => setDebugElementId( e.target.value ) }
					sx={ { marginTop: '10px' } }
				/>
				<Divider sx={ { marginTop: '20px' } } />
			</Box>
			<form
				onSubmit={ async ( e ) => {
					e.preventDefault();

					await submit( { elementId: debugElementId, prompt: e.target.prompt.value } );

					e.target.reset();
				} }
				style={ { padding: '20px', display: 'flex' } }
			>
				<Button
					disabled={ 0 === results.past.length }
					onClick={ () => undo( { elementId: debugElementId } ) }
				>
					Undo
				</Button>
				<Button
					disabled={ 0 === results.future.length }
					onClick={ () => redo( { elementId: debugElementId } ) }
				>
					Redo
				</Button>
				<TextField
					sx={ { width: '100%' } }
					name="prompt"
					defaultValue={ results.current?.nextPrompt || '' }
					key={ results.current?.nextPrompt || '__EMPTY__' }
				/>
				<Button variant="contained" type="submit" disabled={ 'pending' === status }>
					{ results.current?.nextPrompt ? 'Regenerate' : 'Generate' }
				</Button>
			</form>
		</Drawer>
	);
}

function send( { elementId, prompt } ) {
	return new Promise( ( resolve ) => {
		const aiPromptResult = `<row><text>${ prompt }</text></row>`;

		const { content: [ element ] } = window.elementor.html4Parser.parse(
			aiPromptResult,
			elementId || null,
		);

		setTimeout( () => resolve( element ), 1500 );
	} );
}
