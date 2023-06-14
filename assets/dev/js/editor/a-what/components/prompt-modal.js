import { Button, Drawer, TextField } from '@elementor/ui';
import { useDispatch, useSelector } from '@elementor/store';
import { selectElementResults, selectStatus, slice } from '../store';
import defaultMessages from '../api/messages';
import { env } from '../env';

export default function PromptModal( { setElementId, elementId } ) {
	const dispatch = useDispatch();
	const results = useSelector( ( state ) => selectElementResults( state, elementId ) );
	const status = useSelector( selectStatus );

	const submit = async ( { prompt, eId } ) => {
		dispatch( slice.actions.start( { elementId: eId, prompt } ) );

		const result = await request( {
			prompt,
			results: [ ...results.past, results.current ].filter( Boolean ),
		} );

		// Const result = `<row><text>${ prompt }</text></row>`;

		dispatch( slice.actions.end( { elementId: eId, result } ) );

		setElementId( eId );
	};

	const undo = ( { eId } ) => dispatch( slice.actions.undo( { elementId: eId } ) );
	const redo = ( { eId } ) => dispatch( slice.actions.redo( { elementId: eId } ) );

	return (
		<Drawer
			anchor="bottom"
			open={ !! elementId }
			onClose={ () => setElementId( null ) }
		>
			<form
				onSubmit={ async ( e ) => {
					e.preventDefault();

					await submit( { eId: elementId, prompt: e.target.prompt.value } );

					e.target.reset();
				} }
				style={ { padding: '20px', display: 'flex' } }
			>
				<Button
					disabled={ 0 === results.past.length }
					onClick={ () => undo( { eId: elementId } ) }
				>
					Undo
				</Button>
				<Button
					disabled={ 0 === results.future.length }
					onClick={ () => redo( { eId: elementId } ) }
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
				if ( result.result ) {
					acc.push( {
						role: 'assistant',
						content: result.result,
					} );
				}

				if ( result.nextPrompt ) {
					acc.push( {
						role: 'user',
						content: result.nextPrompt,
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
