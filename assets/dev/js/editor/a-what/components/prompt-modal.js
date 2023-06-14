import { useRef } from 'react';
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, IconButton, Stack, Divider, Tooltip, ToggleButton, CircularProgress, styled } from '@elementor/ui';
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

const StyledDialogTitle = styled( DialogTitle )( ( { theme } ) => ( {
	'&.MuiDialogTitle-root': {
		backgroundColor: 'dark' === theme.palette.mode ? theme.palette.background.paper : theme.palette.grey[ 100 ],
		padding: theme.spacing( 0, 6 ),
	},
} ) );

const StyledDialogContent = styled( DialogContent )( ( { theme } ) => ( {
	'&.MuiDialogContent-root': {
		padding: theme.spacing( 6 ),
	},
} ) );

const GenerateButton = styled( Button )( ( { theme } ) => ( {
	width: 130,
	borderRadius: theme.border.radius.sm,
} ) );

export default function PromptModal( { setElementId, elementId } ) {
	const dispatch = useDispatch();
	const results = useSelector( ( state ) => selectElementResults( state, elementId ) );
	const status = useSelector( selectStatus );
	const promptInputRef = useRef();

	const generateButtonText = results.current?.nextPrompt ? 'Regenerate' : 'Generate';

	const inputPromptPlaceholder = 'I want a hero section with background image and two columns.';

	const submit = async ( { prompt, eId } ) => {
		if ( ! promptInputRef.current.value.trim() ) {
			return;
		}

		dispatch( slice.actions.start( { elementId: eId, prompt } ) );

		const result = await request( {
			prompt,
			results: [ ...results.past, results.current ].filter( Boolean ),
		} );

		const isValid = result.includes( '<' );

		if ( isValid ) {
			window.last_result = result;

			// Const result = `<row><text>${ prompt }</text></row>`;

			dispatch( slice.actions.end( { elementId: eId, result } ) );
		} else {
			dispatch( slice.actions.error( { elementId: eId, error: result } ) );
		}

		setElementId( eId );
	};

	const undo = ( { eId } ) => dispatch( slice.actions.undo( { elementId: eId } ) );
	const redo = ( { eId } ) => dispatch( slice.actions.redo( { elementId: eId } ) );

	return (
		<Draggable handle=".MuiDialogTitle-root" cancel={ '[class*="MuiDialogContent-root"]' }>
			<Dialog
				open={ !! elementId }
				fullWidth={ true }
				hideBackdrop={ true }
				scroll="paper"
				maxWidth="md"
				sx={ {
					position: 'absolute',
					bottom: 56,
					left: 0,
					right: 'initial',
					top: 'initial',
					width: '100%',
					height: 'auto',
					'& .MuiDialog-container': {
						alignItems: 'flex-end',
					},
				} }
				PaperProps={ {
					sx: {
						m: 0,
					},
				} }
			>
				<StyledDialogTitle sx={ { bgcolor: 'background.paper' } }>
					<Stack direction="row" spacing={ 3 } alignItems="center">
						<Tooltip title="Generate with text">
							<Box component="span" sx={ { cursor: 'pointer' } }>
								<ToggleButton
									size="small"
									aria-label="close"
									onClick={ () => setElementId( null ) }
									selected
									value
									disabled={ 'pending' === status }
								>
									<TextIcon />
								</ToggleButton>
							</Box>
						</Tooltip>

						<Tooltip title="Soon.. (Generate with image)">
							<Box component="span" sx={ { cursor: 'pointer' } }>
								<IconButton
									size="small"
									aria-label="close"
									onClick={ () => setElementId( null ) }
									disabled
								>
									<BrushIcon />
								</IconButton>
							</Box>
						</Tooltip>

					</Stack>

					<Divider orientation="vertical" variant="middle" flexItem sx={ { mx: 4, my: 3 } } />

					<Stack direction="row" spacing={ 3 } alignItems="center">
						<Tooltip title="Undo">
							<Box component="span" sx={ { cursor: 'pointer' } }>
								<IconButton
									size="small"
									aria-label="close"
									onClick={ () => undo( { eId: elementId } ) }
									disabled={ 'pending' === status || 0 === results.past.length }
								>
									<UndoIcon />
								</IconButton>
							</Box>
						</Tooltip>

						<Tooltip title="Redo">
							<Box component="span" sx={ { cursor: 'pointer' } }>
								<IconButton
									size="small"
									aria-label="close"
									onClick={ () => redo( { eId: elementId } ) }
									disabled={ 'pending' === status || 0 === results.future.length }
								>
									<RedoIcon />
								</IconButton>
							</Box>
						</Tooltip>
					</Stack>

					<Stack direction="row" spacing={ 3 } alignItems="center" sx={ { ml: 'auto' } }>
						<IconButton
							size="small"
							aria-label="close"
							onClick={ () => setElementId( null ) }
							sx={ { '&.MuiButtonBase-root': { mr: -3 } } }
						>
							<XIcon />
						</IconButton>
					</Stack>
				</StyledDialogTitle>

				<StyledDialogContent>
					<Box component="form"
						onSubmit={ async ( e ) => {
							e.preventDefault();

							await submit( { eId: elementId, prompt: e.target.prompt.value } );

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
							// eslint-disable-next-line jsx-a11y/no-autofocus
							autoFocus={ true }
							onKeyDown={ ( event ) => {
								if ( 'Tab' === event.key ) {
									event.preventDefault();
									promptInputRef.current.value = inputPromptPlaceholder;
								}
							} }
							sx={ {
								'& .Mui-disabled': {
									bgcolor: 'background.default',
								},
							} }
						/>

						<Stack direction="row" alignItems="center" spacing={ 4 } sx={ { ml: 4 } }>
							{
								false
									? <CircularProgress color="secondary" size={ 16 } />
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

							<GenerateButton
								variant="contained"
								type="submit"
								disabled={ 'pending' === status }
								startIcon={ 'pending' !== status && <AIIcon /> }
								size="small"
							>
								{
									'pending' === status
										? <CircularProgress color="secondary" size={ 20 } />
										: generateButtonText
								}
							</GenerateButton>
						</Stack>
					</Box>
				</StyledDialogContent>
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
