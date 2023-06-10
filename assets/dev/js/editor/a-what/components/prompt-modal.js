import { Box, Button, Divider, Drawer, TextField, Typography } from '@elementor/ui';
import { useDispatch, useSelector } from '@elementor/store';
import { useState } from 'react';
import { selectElementResults, selectStatus, slice } from '../store';
import defaultMessages from '../api/messages';
import { env } from '../env';

export default function PromptModal( { open, onClose } ) {
	const [ debugElementId, setDebugElementId ] = useState( '' );

	const dispatch = useDispatch();
	const results = useSelector( ( state ) => selectElementResults( state, debugElementId ) );
	const status = useSelector( selectStatus );

	const submit = async ( { prompt, elementId } ) => {
		elementId = elementId || elementorCommon.helpers.getUniqueId();

		dispatch( slice.actions.start( { elementId, prompt } ) );

		const result = await request( {
			prompt,
			results: [ results.current, ...results.past ].filter( Boolean ),
		} );

		dispatch( slice.actions.end( { elementId, result } ) );

		setDebugElementId( elementId );
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

function request( { prompt, results } ) {
	const body = {
		messages: [
			...defaultMessages,
			...results.reduce( ( acc, result ) => {
				if ( result.nextPrompt ) {
					acc.push( {
						role: 'user',
						content: result.nextPrompt,
					} );
				}

				if ( result.result ) {
					acc.push( {
						role: 'assistant',
						content: result.result,
					} );
				}

				return acc;
			}, [] ),
			{
				role: 'user',
				content: prompt,
			},
		],
		model: 'gpt-3.5-turbo',
	};

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${ env.apiKey }`,
	};

	return fetch( env.apiURL, {
		method: 'POST',
		headers,
		body: JSON.stringify( body ),
	} )
		.then( ( response ) => response.json() )
		.then( ( data ) => data.choices[ 0 ].message.content )
		.catch( ( error ) => console.log( error ) );
}
