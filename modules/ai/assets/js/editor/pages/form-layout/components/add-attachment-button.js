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
				color="secondary"
				size="small"
				variant="outlined"
				sx={ {
					borderRadius: '50%',
					borderWidth: 2,
					width: 24,
					height: 24,
					padding: 0,
					minWidth: 24,
					background: 'g.700',
					ml: 1,
				} }
			>
				{ open ? 'X' : '+' }
			</Button>

			<Popover
				open={ open }
				anchorEl={ anchorRef.current }
				onClose={ () => setOpen( false ) }
				sx={ {
					padding: 16,
				} }
				anchorOrigin={ {
					vertical: 'bottom',
					horizontal: 'left',
				} }
			>
				<Typography sx={ { p: 2, cursor: 'pointer' } } variant="body2" onClick={ () => props.onSelect( 'url' ) }>
					URL as a reference
				</Typography>
			</Popover>
		</>
	);
};

AddAttachmentButton.propTypes = {
	disabled: PropTypes.bool,
	onSelect: PropTypes.func,
};
