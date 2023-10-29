import { useEffect, useState } from 'react';
import { UrlDialog } from './url-dialog';
import { Thumbnail } from './thumbnail';
import { useAttachUrlService } from '../../hooks/use-attach-url-service';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

const MODE_SELECT = 'select';
const MODE_THUMBNAIL = 'thumbnail';

export const UrlAttachment = ( props ) => {
	const initialAttachment = props.attachments?.find( ( item ) => 'html' === item.type );

	const [ mode, setMode ] = useState( initialAttachment ? MODE_THUMBNAIL : MODE_SELECT );
	const [ attachment, setAttachment ] = useState( initialAttachment ? initialAttachment.html : '' );
	const { iframeSource, setCurrentUrl } = useAttachUrlService();
	const [ isIframeLoaded, setIsIframeLoaded ] = useState( false );

	useEffect( () => {
		const onMessage = ( event ) => {
			const { type, html, url } = event.data;

			if ( 'inspiration-loaded' === type ) {
				setIsIframeLoaded( true );
			}

			if ( 'inspiration-close' === type ) {
				if ( attachment ) {
					setMode( MODE_THUMBNAIL );
				} else {
					props.onDetach();
				}
			}

			if ( 'inspiration-html' === type ) {
				const host = new URL( url ).host;

				props.onAttach( [ {
					type: 'url',
					content: html,
					label: host,
				} ] );
				setCurrentUrl( url );
				setAttachment( html );
				setMode( MODE_THUMBNAIL );
			}
		};

		window.addEventListener( 'message', onMessage );

		return () => {
			window.removeEventListener( 'message', onMessage );
		};
	}, [ attachment ] );

	useEffect( () => {
		const timeout = setTimeout( () => {
			if ( ! isIframeLoaded ) {
				props.onDetach();
				window.alert( __( 'Cannot load the app. Please try again later.' ) );
			}
		}, 4000 );

		return () => {
			clearTimeout( timeout );
		};
	}, [ isIframeLoaded ] );

	if ( MODE_THUMBNAIL === mode ) {
		return (
			<Thumbnail
				disabled={ props.disabled }
				html={ attachment }
				onClick={ () => {
					setMode( MODE_SELECT );
				} }
				allowRemove={ true }
				onRemove={ ( event ) => {
					event.stopPropagation();
					setAttachment( '' );
					setCurrentUrl( '' );
					props.onDetach();
				} }
			/>
		);
	}

	return (
		<UrlDialog
			title={ __( 'URL as a reference' ) }
			iframeSource={ iframeSource }
		/>
	);
};

UrlAttachment.propTypes = {
	attachments: PropTypes.array,
	onAttach: PropTypes.func,
	onDetach: PropTypes.func,
	disabled: PropTypes.bool,
};

export default UrlAttachment;
