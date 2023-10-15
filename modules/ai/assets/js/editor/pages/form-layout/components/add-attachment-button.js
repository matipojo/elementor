import { useRef, useState } from 'react';
import { Button, Popover, Typography } from '@elementor/ui';

export const AddAttachmentButton = ( props ) => {
	const [ open, setOpen ] = useState( false );
	const anchorRef = useRef( null );

	return (
		<>
			<Button
				ref={ anchorRef }
				disabled={ props.disabled }
				onClick={ () => setOpen( true ) }
				color="primary"
				size="small"
				variant="contained"
				sx={ { ml: 1 } }
			>
				+
			</Button>

			<Popover
				open={ open }
				anchorEl={ anchorRef.current }
				onClose={ () => setOpen( false ) }
				sx={ {
					padding: 8,
				} }
				anchorOrigin={ {
					vertical: 'bottom',
					horizontal: 'left',
				} }
			>
				<Typography sx={ { p: 2, cursor: 'pointer' } } variant="body2" onClick={ () => props.onSelect( 'url' ) }>
					Select from an existing website
				</Typography>
			</Popover>
		</>
	);
};

AddAttachmentButton.propTypes = {
	disabled: PropTypes.bool,
	onSelect: PropTypes.func,
};
