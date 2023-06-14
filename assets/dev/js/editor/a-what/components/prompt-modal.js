import { useRef, useState } from 'react';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, IconButton, Stack, Divider, Tooltip, ToggleButton, CircularProgress } from '@elementor/ui';
import { useDispatch, useSelector } from '@elementor/store';
import { XIcon, AIIcon } from '@elementor/icons';
import { selectElementResults, selectStatus, slice } from '../store';
import defaultMessages from '../api/messages';
import { env } from '../env';
import Draggable from 'react-draggable';
import TextIcon from '../icons/text-icon';
import BrushIcon from '../icons/brush-icon';
import RedoIcon from '../icons/redo-icon';
import UndoIcon from '../icons/undo-icon';
import WandIcon from '../icons/wand-icon';

export default function PromptModal( { open, onClose } ) {
	const [ debugElementId, setDebugElementId ] = useState( '' );

	const dispatch = useDispatch();
	const results = useSelector( ( state ) => selectElementResults( state, debugElementId ) );
	const status = useSelector( selectStatus );
	const promptInputRef = useRef();

	const inputPromptPlaceholder = 'I want a hero section with background image and two columns.';

	const submit = async ( { prompt, elementId } ) => {
		elementId = elementId || elementorCommon.helpers.getUniqueId();

		dispatch( slice.actions.start( { elementId, prompt } ) );

		const result = await request( {
			prompt,
			results: [ ...results.past, results.current ].filter( Boolean ),
		} );

		dispatch( slice.actions.end( { elementId, result } ) );

		setDebugElementId( elementId );
	};

	const undo = ( { elementId } ) => dispatch( slice.actions.undo( { elementId } ) );
	const redo = ( { elementId } ) => dispatch( slice.actions.redo( { elementId } ) );

	return (
		<Draggable handle=".MuiDialogTitle-root" cancel={ '[class*="MuiDialogContent-root"]' }>
			<Dialog
				open={ open }
				fullWidth={ true }
				hideBackdrop={ true }
				scroll="paper"
				maxWidth="md"
				sx={ {
					'& .MuiDialog-container': {
						alignItems: 'flex-end',
						// Mb: '18vh',
					},
				} }
				PaperProps={ {
					sx: {
						m: 0,
						mb: 11,
					},
				} }
			>
				<DialogTitle sx={ { bgcolor: 'background.paper' } }>
					<Stack direction="row" spacing={ 3 } alignItems="center">
						<Tooltip title="Generate with text">
							<ToggleButton
								size="small"
								aria-label="close"
								onClick={ onClose }
								selected
								value
								disabled={ 'pending' === status }
							>
								<TextIcon />
							</ToggleButton>
						</Tooltip>

						<Tooltip title="Soon.. (Generate with image)">
							<IconButton
								size="small"
								aria-label="close"
								onClick={ onClose }
								disabled
							>
								<BrushIcon />
							</IconButton>
						</Tooltip>

					</Stack>

					<Divider orientation="vertical" variant="middle" flexItem sx={ { mx: 4, my: 3 } } />

					<Stack direction="row" spacing={ 3 } alignItems="center">
						<Tooltip title="Undo">
							<IconButton
								size="small"
								aria-label="close"
								onClick={ undo }
								disabled={ 'pending' === status }
							>
								<UndoIcon />
							</IconButton>
						</Tooltip>

						<Tooltip title="Redo">
							<IconButton
								size="small"
								aria-label="close"
								onClick={ redo }
								disabled={ 'pending' === status }
							>
								<RedoIcon />
							</IconButton>
						</Tooltip>
					</Stack>

					<Stack direction="row" spacing={ 3 } alignItems="center" sx={ { ml: 'auto' } }>
						<IconButton
							size="small"
							aria-label="close"
							onClick={ onClose }
							sx={ { '&.MuiButtonBase-root': { mr: -4 } } }
						>
							<XIcon />
						</IconButton>
					</Stack>
				</DialogTitle>

				<DialogContent>
					<Box component="form"
						onSubmit={ async ( e ) => {
							e.preventDefault();

							await submit( { elementId: debugElementId, prompt: e.target.prompt.value } );

							e.target.reset();
						} }
						display="flex"
					>
						<TextField
							ref={ promptInputRef }
							fullWidth
							name="prompt"
							defaultValue={ results.current?.nextPrompt || '' }
							key={ results.current?.nextPrompt || '__EMPTY__' }
							placeholder={ inputPromptPlaceholder }
							color="secondary"
							variant="standard"
							disabled={ 'pending' === status }
							autoFocus={ true }
							onKeyDown={ ( event ) => {
								if ( 'Tab' === event.key ) {
									event.preventDefault();
									promptInputRef.current.value = inputPromptPlaceholder;
								}
							} }
						/>

						<Stack direction="row" alignItems="center" spacing={ 3 } sx={ { ml: 5 } }>
							{
								false
									? <CircularProgress color="secondary" size={ 20 } sx={ { mr: 2 } } />
									: <Tooltip title="Enhance prompt">
										<Box component="span" sx={ { cursor: 'pointer' } }>
											<IconButton
												size="small"
												color="secondary"
												onClick={ () => {} }
												disabled={ 'pending' === status }
											>
												<WandIcon />
											</IconButton>
										</Box>
									</Tooltip>
							}

							<Button
								variant="contained"
								type="submit"
								disabled={ 'pending' === status }
								startIcon={ <AIIcon /> }
								size="small"
							>
								{ results.current?.nextPrompt ? 'Regenerate' : 'Generate' }
							</Button>
						</Stack>
					</Box>
				</DialogContent>
			</Dialog>
		</Draggable>
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
