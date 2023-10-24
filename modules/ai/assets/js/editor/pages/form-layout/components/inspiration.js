import {
	IconButton, Box,
} from '@elementor/ui';
import { useEffect, useRef, useState } from 'react';
import { XIcon } from '@elementor/icons';
import { AddAttachmentButton } from './add-attachment-button';
import { UrlDialog } from './attachments/url-dialog';

// Const APP_BASE_URL = 'https://ai-h2e-helper.s3.eu-west-1.amazonaws.com';
const APP_BASE_URL = 'http://localhost:3000';

const Inspiration = ( { onAttach, onDetach, disabled, ...props } ) => {
	const [ mode, setMode ] = useState( 'button' ); // ['select', 'preview', 'button']
	const [ attachment, setAttachment ] = useState( '' );
	const [ startUrl, setStartUrl ] = useState( '' );
	const previewRef = useRef( null );

	const urlObject = new URL( APP_BASE_URL );

	const colorScheme = elementor?.getPreferences?.( 'ui_theme' ) || 'auto';
	const isRTL = elementorCommon.config.isRTL;

	urlObject.searchParams.append( 'colorScheme', colorScheme );
	urlObject.searchParams.append( 'isRTL', isRTL );
	urlObject.searchParams.append( 'locale', elementor.config.locale );
	urlObject.searchParams.append( 'url', startUrl );

	useEffect( () => {
		if ( previewRef.current ) {
			const attachmentWidth = previewRef.current.querySelector( '*' ).offsetWidth;
			console.log( attachmentWidth );
			previewRef.current.style.transform = 'scale(' + ( 50 / attachmentWidth ) + ')';
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
		return <AddAttachmentButton
			disabled={ disabled }
			onSelect={ ( type ) => {
				switch ( type ) {
					case 'url':
						setMode( 'select' );
						break;
				}
			} }
		/>;
	}

	if ( attachment && 'preview' === mode ) {
		return (
			<Box sx={ {
				width: 50,
				height: 50,
				border: '1px solid gray',
				position: 'relative',
				cursor: 'pointer',
				opacity: disabled ? 0.5 : 1,
				'&:hover .remove-attachment': {
					display: 'block',
				},
			} } onClick={ () => {
				setMode( 'select' );
			} }
			>
				<IconButton
					className="remove-attachment"
					size="small"
					aria-label="close"
					disabled={ disabled }
					onClick={ ( event ) => {
						setMode( 'button' );
						setAttachment( '' );
						onDetach();
						event.stopPropagation();
					} }
					sx={ {
						display: 'none',
						position: 'absolute',
						insetInlineEnd: 0,
						backgroundColor: 'grey.200',
						zIndex: 1,
						'&:hover': {
							backgroundColor: 'grey.200',
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

	return ( <UrlDialog
		iframeSource={ urlObject.toString() }
		onClose={ () => {
			setMode( attachment ? 'preview' : 'button' );
		} }
	/> );
};

Inspiration.propTypes = {
	onAttach: PropTypes.func,
	onDetach: PropTypes.func,
	disabled: PropTypes.bool,
};

export default Inspiration;
