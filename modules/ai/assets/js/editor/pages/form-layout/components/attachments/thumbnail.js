import { useEffect, useRef } from 'react';
import { Box, IconButton } from '@elementor/ui';
import { TrashIcon } from '@elementor/icons';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

export const Thumbnail = ( props ) => {
	const previewRef = useRef( null );

	useEffect( () => {
		if ( previewRef.current ) {
			const attachmentWidth = previewRef.current.querySelector( '*' )?.offsetWidth || 1;
			previewRef.current.style.transform = 'scale(' + ( 50 / attachmentWidth ) + ')';
		}
	}, [] );

	return (
		<Box sx={ {
			width: 60,
			height: 60,
			border: '1px solid grey',
			position: 'relative',
			cursor: 'pointer',
			overflow: 'hidden',
			borderRadius: '5px',
			opacity: props.disabled ? 0.5 : 1,
			'&:hover::before': {
				content: '""',
				position: 'absolute',
				inset: 0,
				backgroundColor: 'rgba(0,0,0,0.6)',
			},
			'&:hover .remove-attachment': {
				display: 'block',
			},
		} } onClick={ props.onClick }
		>
			{ props.allowRemove &&
				<IconButton
					className="remove-attachment"
					size="small"
					aria-label={ __( 'Remove' ) }
					disabled={ props.disabled }
					onClick={ props.onRemove }
					sx={ {
						display: 'none',
						position: 'absolute',
						insetInlineEnd: 0,
						backgroundColor: 'secondary.main',
						zIndex: 1,
						borderRadius: '5px',
						'&:hover': {
							backgroundColor: 'secondary.dark',
						},
					} }
				>
					<TrashIcon sx={ {
						color: 'common.white',
					} } />
				</IconButton>
			}

			<Box>
				<Box
					ref={ previewRef }
					sx={ {
						pointerEvents: 'none',
						transform: 'scale(0.10)',
						transformOrigin: 'top left',
					} }
					dangerouslySetInnerHTML={ {
						__html: props.html,
					} }
				/>
			</Box>

		</Box>
	);
};

Thumbnail.propTypes = {
	disabled: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
	allowRemove: PropTypes.bool,
	onRemove: PropTypes.func.isRequired,
	html: PropTypes.string.isRequired,
};
