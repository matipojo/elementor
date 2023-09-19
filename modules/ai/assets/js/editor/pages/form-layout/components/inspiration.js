import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Chip } from '@elementor/ui';
import { useState } from 'react';

const Inspiration = ( { title, text, ...props } ) => {
	const [ isOpen, setIsOpen ] = useState( false );

	if ( ! isOpen ) {
		return <Chip
			label={ __( 'Get Inspiration', 'elementor' ) }
			onClick={ () => setIsOpen( true ) }
			color="default"
			size="small"
			sx={ { ml: 1 } }
		/>;
	}

	return (
		<Dialog
			aria-labelledby="unsaved-changes-alert-title"
			aria-describedby="unsaved-changes-alert-description"
			open={ true }
			fullScreen={ true }
			maxWidth="md"
			style={ {
				maxWidth: 1165,
				margin: '0 auto',
			} }
			{ ...props }
		>
			<DialogTitle id="unsaved-changes-alert-title">
				{ title }
			</DialogTitle>

			<DialogContent>
				<DialogContentText id="unsaved-changes-alert-description">
					{ text }
				</DialogContentText>

				<iframe title="Get Inspiration" src="http://localhost:3000/" style={ {
					border: 'none',
					overflow: 'scroll',
					width: '100%',
					height: '1000px',

				} }></iframe>
			</DialogContent>

			<DialogActions>
				<Button onClick={ () => {
					setIsOpen( false );
				} } color="secondary">
					{ __( 'Close', 'elementor' ) }
				</Button>
			</DialogActions>

		</Dialog>
	);
};

Inspiration.propTypes = {
	title: PropTypes.string,
	text: PropTypes.string,
};

export default Inspiration;
