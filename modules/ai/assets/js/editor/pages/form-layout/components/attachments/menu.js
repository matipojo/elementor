import { useRef, useState } from 'react';
import { Button, Popover, Stack, useTheme } from '@elementor/ui';
import { MenuItem } from './menu-item';
import WebsiteIcon from '../../../../icons/website-icon';
import XCircleIcon from '../../../../icons/x-circle-icon';
import PlusCircleIcon from '../../../../icons/plus-circle-icon';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

export const Menu = ( props ) => {
	const [ isOpen, setIsOpen ] = useState( false );
	const { direction } = useTheme();
	const anchorRef = useRef( null );

	return (
		<>
			<Button
				ref={ anchorRef }
				disabled={ props.disabled }
				onClick={ () => setIsOpen( true ) }
				color="secondary"
				variant="text"
				sx={ {
					width: 24,
					minWidth: 24,
				} }
			>
				{ isOpen ? <XCircleIcon /> : <PlusCircleIcon /> }
			</Button>

			<Popover
				open={ isOpen }
				anchorEl={ anchorRef.current }
				onClose={ () => setIsOpen( false ) }
				anchorOrigin={ {
					vertical: 'bottom',
					horizontal: 'rtl' === direction ? 'right' : 'left',
				} }
			>
				<Stack spacing={ 2 } sx={ {
					width: 440,
				} }>
					<MenuItem
						title={ __( 'URL as a reference', 'elementor' ) }
						icon={ <WebsiteIcon sx={ {
							me: 1,
						} } /> }
						onClick={ () => props.onSelect( 'url' ) }
					/>
				</Stack>
			</Popover>
		</>
	);
};

Menu.propTypes = {
	disabled: PropTypes.bool,
	onSelect: PropTypes.func,
};
