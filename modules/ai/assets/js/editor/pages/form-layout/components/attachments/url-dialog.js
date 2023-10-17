import { AppBar, Dialog, DialogContent, IconButton, Stack, Toolbar, Typography } from '@elementor/ui';
import { XIcon } from '@elementor/icons';
import { useEffect, useState } from 'react';

export const UrlDialog = ( props ) => {
	const [ height, setHeight ] = useState( 150 );

	useEffect( () => {
		const onMessage = ( event ) => {
			if ( 'height' === event.data.type ) {
				setHeight( event.data.height );
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
						<Typography variant="body2" sx={ { mr: 1 } }>
							URL selector
						</Typography>
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
				<iframe title="Get Inspiration" src={ props.iframeSource } style={ {
					border: 'none',
					overflow: 'scroll',
					width: '100%',
					height: '100%',
				} }></iframe>
			</DialogContent>
		</Dialog>
	);
};

UrlDialog.propTypes = {
	iframeSource: PropTypes.string.isRequired,
};
