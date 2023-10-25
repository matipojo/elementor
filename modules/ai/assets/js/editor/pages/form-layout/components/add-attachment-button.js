import { useRef, useState } from 'react';
import { Button, Popover, Stack, Typography } from '@elementor/ui';
import PropTypes from 'prop-types';
import WebsiteIcon from '../../../icons/website';
import XCircleIcon from '../../../icons/x-circle';
import PlusCircleIcon from '../../../icons/plus-circle';

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
				variant="text"
				sx={ {
					width: 24,
					height: 24,
					padding: 0,
					minWidth: 24,
					ml: 1,
				} }
			>
				{ open ? <XCircleIcon /> : <PlusCircleIcon /> }
			</Button>

			<Popover
				open={ open }
				anchorEl={ anchorRef.current }
				onClose={ () => setOpen( false ) }
				anchorOrigin={ {
					vertical: 'bottom',
					horizontal: 'left',
				} }
			>
				<Stack spacing={ 2 } sx={ {
					width: 440,
					p: 2,
				} }>
					<Typography sx={ { cursor: 'pointer' } } variant="body2" onClick={ () => props.onSelect( 'url' ) }>
						<Stack direction="row" spacing={ 1 } sx={ {
							alignItems: 'center',
						} }>
							<WebsiteIcon sx={ { me: 1 } } />
							<span>URL as a reference</span>
						</Stack>
					</Typography>
				</Stack>
			</Popover>
		</>
	);
};

AddAttachmentButton.propTypes = {
	disabled: PropTypes.bool,
	onSelect: PropTypes.func,
};
