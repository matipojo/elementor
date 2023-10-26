import { useEffect } from 'react';
import { Dialog, DialogContent } from '@elementor/ui';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

export const UrlDialog = ( props ) => {
	useEffect( () => {
		const onMessage = ( event ) => {
			if ( 'inspiration-close' === event.data.type ) {
				props.onClose();
			}
		};

		window.addEventListener( 'message', onMessage );
		return () => {
			window.removeEventListener( 'message', onMessage );
		};
	}, [] );

	return (
		<Dialog
			open={ true }
			fullScreen={ true }
			hideBackdrop={ true }
			maxWidth="md"
			sx={ {
				'& .MuiPaper-root': {
					backgroundColor: 'transparent',
				},
			} }
			{ ...props }
		>
			<DialogContent
				sx={ {
					padding: 0,
				} }
			>
				<iframe
					title={ __( 'URL as a reference' ) }
					src={ props.iframeSource }
					style={ {
						border: 'none',
						overflow: 'scroll',
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(255,255,255,0.6)',
					} }
				/>
			</DialogContent>
		</Dialog>
	);
};

UrlDialog.propTypes = {
	iframeSource: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
};
