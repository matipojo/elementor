import { useEffect, useState } from 'react';
import { useTheme } from '@elementor/ui';
import { Menu } from './attachments/menu';
import { UrlDialog } from './attachments/url-dialog';
import { Thumbnail } from './attachments/thumbnail';
import PropTypes from 'prop-types';

const MODE_SELECT = 'select';
const MODE_THUMBNAIL = 'thumbnail';
const MODE_BUTTON = 'button';

// Const APP_BASE_URL = 'https://ai-h2e-helper.s3.eu-west-1.amazonaws.com';
const APP_BASE_URL = 'http://localhost:3000';
const Attachments = ( { onAttach, onDetach, disabled } ) => {
	const [ mode, setMode ] = useState( MODE_BUTTON ); // [ MODE_SELECT, MODE_THUMBNAIL, MODE_BUTTON ]
	const [ attachment, setAttachment ] = useState( '' );
	const [ startUrl, setStartUrl ] = useState( '' );
	const theme = useTheme();

	const urlObject = new URL( APP_BASE_URL );
	urlObject.searchParams.append( 'colorScheme', theme.palette.mode );
	urlObject.searchParams.append( 'isRTL', 'rtl' === theme.direction ? 'true' : 'false' );
	urlObject.searchParams.append( 'locale', theme.locale );
	urlObject.searchParams.append( 'url', startUrl );

	useEffect( () => {
		const onMessage = ( event ) => {
			const { type, html, url } = event.data;

			if ( 'inspiration-html' !== type ) {
				return;
			}
			setStartUrl( url );
			setAttachment( html );
			onAttach( url, html );
			setMode( MODE_THUMBNAIL );
		};

		window.addEventListener( 'message', onMessage );

		return () => {
			window.removeEventListener( 'message', onMessage );
		};
	}, [ startUrl ] );

	if ( MODE_BUTTON === mode ) {
		return (
			<Menu
				disabled={ disabled }
				onSelect={ ( type ) => {
					switch ( type ) {
						case 'url':
							setMode( MODE_SELECT );
							break;
					}
				} }
			/>
		);
	}

	if ( MODE_THUMBNAIL === mode ) {
		return (
			<Thumbnail
				disabled={ disabled }
				html={ attachment }
				onClick={ () => {
					setMode( MODE_SELECT );
				} }

				onRemove={ ( event ) => {
					setMode( MODE_BUTTON );
					setAttachment( '' );
					setStartUrl( '' );
					onDetach();
					event.stopPropagation();
				} }
			/>
		);
	}

	return (
		<UrlDialog
			iframeSource={ urlObject.toString() }
			onClose={ () => {
				setMode( attachment ? MODE_THUMBNAIL : MODE_BUTTON );
				if ( ! attachment ) {
					setStartUrl( '' );
				}
			} }
		/>
	);
};

Attachments.propTypes = {
	onAttach: PropTypes.func,
	onDetach: PropTypes.func,
	disabled: PropTypes.bool,
};

export default Attachments;
