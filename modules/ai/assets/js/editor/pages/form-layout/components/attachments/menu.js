import { useRef, useState } from 'react';
import { Button, Popover, Stack, Typography, useTheme } from '@elementor/ui';
import WebsiteIcon from '../../../../icons/website-icon';
import XCircleIcon from '../../../../icons/x-circle-icon';
import PlusCircleIcon from '../../../../icons/plus-circle-icon';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

export const Menu = ( props ) => {
	const [ open, setOpen ] = useState( false );
	const anchorRef = useRef( null );
	const { direction } = useTheme();

	return (
		<>
			<Button
				ref={ anchorRef }
				disabled={ props.disabled }
				onClick={ () => setOpen( true ) }
				color="secondary"
				variant="text"
				sx={ {
					width: 24,
					minWidth: 24,
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
					horizontal: 'rtl' === direction ? 'right' : 'left',
				} }
			>
				<Stack spacing={ 2 } sx={ {
					width: 440,
				} }>
					<Stack
						direction="row"
						spacing={ 1 }
						sx={ {
							cursor: 'pointer',
							alignItems: 'center',
							p: 2,
						} }
						variant="body2"
						onClick={ () => props.onSelect( 'url' ) }
					>
						<WebsiteIcon sx={ { me: 1 } } />
						<Typography>
							{ __( 'URL as a reference' ) }
						</Typography>
					</Stack>
				</Stack>
			</Popover>
		</>
	);
};

Menu.propTypes = {
	disabled: PropTypes.bool,
	onSelect: PropTypes.func,
};
