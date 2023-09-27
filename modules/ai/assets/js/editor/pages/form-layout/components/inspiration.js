import {
	Dialog,
	DialogContent,
	Toolbar, Stack, IconButton, AppBar, Box, Button,
} from '@elementor/ui';
import { useEffect, useRef, useState } from 'react';
import { XIcon } from '@elementor/icons';

const Inspiration = ( { onAttach, ...props } ) => {
	const [ mode, setMode ] = useState( 'button' ); // ['select', 'preview', 'button']
	const [ attachment, setAttachment ] = useState( '' );
	const [ startUrl, setStartUrl ] = useState( '' );
	const previewRef = useRef( null );
	const iframeSource = 'https://ai-h2e-helper.s3.eu-west-1.amazonaws.com/index.html?url=' + startUrl;

	useEffect( () => {
		if ( previewRef.current ) {
			const attachmentWidth = previewRef.current.querySelector( '*' ).offsetWidth;
			console.log( attachmentWidth );
			previewRef.current.style.transform = 'scale(' + ( 150 / attachmentWidth ) + ')';
		}
	}, [ attachment, mode ] );

	useEffect( () => {
		const onMessage = ( event ) => {
			const { type, html, url } = event.data;

			if ( 'inspiration-html' !== type ) {
				return;
			}
			setStartUrl( url );
			setAttachment( html );
			onAttach( url, html );
			setMode( 'preview' );
		};

		window.addEventListener( 'message', onMessage );

		return () => {
			window.removeEventListener( 'message', onMessage );
		};
	}, [ startUrl ] );

	if ( 'button' === mode ) {
		return <Button
			onClick={ () => {
				setMode( 'select' );
			} }
			color="secondary"
			size="small"
			variant="contained"
			sx={ { ml: 1 } }
		>
			{ __( 'Attach Inspiration', 'elementor' ) }
		</Button>;
	}

	if ( attachment && 'preview' === mode ) {
		return (
			<Box sx={ {
				width: 150,
				height: 150,
				border: '1px solid gray',
				position: 'relative',
				cursor: 'pointer',
			} } onClick={ () => {
				setMode( 'select' );
			} }
			>
				<IconButton
					size="small"
					aria-label="close"
					onClick={ ( event ) => {
						setMode( 'button' );
						setAttachment( '' );
						event.stopPropagation();
					} }
					sx={ {
						position: 'absolute',
						insetInlineStart: -17,
						backgroundColor: 'grey.200',
						zIndex: 1,
						'&:hover': {
							backgroundColor: 'grey.300',
						},
					} }
				>
					<XIcon />
				</IconButton>

				<Box component="div" sx={ {
					overflow: 'hidden',
				} }>
					<Box component="div"
						ref={ previewRef }
						sx={ {
							transform: 'scale(0.10)',
							transformOrigin: 'top left',
						} } dangerouslySetInnerHTML={ { __html: attachment } }
					/>
				</Box>

			</Box>
		);
	}

	return (
		<Dialog
			open={ true }
			fullScreen={ true }
			maxWidth="md"
			style={ {
				maxWidth: 1165,
				margin: '0 auto',
			} }
			{ ...props }
		>
			<AppBar sx={ { fontWeight: 'normal' } } color="transparent" position="relative">
				<Toolbar variant="dense">
					<Stack direction="row" spacing={ 1 } alignItems="center" sx={ { ml: 'auto' } }>
						<IconButton
							size="small"
							aria-label="close"
							onClick={ () => setMode( attachment ? 'preview' : 'button' ) }
							sx={ { '&.MuiButtonBase-root': { mr: -1 } } }
						>
							<XIcon />
						</IconButton>
					</Stack>
				</Toolbar>
			</AppBar>

			<DialogContent>
				<iframe title="Get Inspiration" src={ iframeSource } style={ {
					border: 'none',
					overflow: 'scroll',
					width: '100%',
					height: '1000px',
				} }></iframe>
			</DialogContent>
		</Dialog>
	);
};

Inspiration.propTypes = {
	onAttach: PropTypes.func,
};

export default Inspiration;

