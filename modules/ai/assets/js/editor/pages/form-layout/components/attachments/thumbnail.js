import { useEffect, useRef } from 'react';
import { Box, IconButton } from '@elementor/ui';
import { XIcon } from '@elementor/icons';
import PropTypes from 'prop-types';

export const Thumbnail = ( props ) => {
	const previewRef = useRef( null );

	useEffect( () => {
		if ( previewRef.current ) {
			const attachmentWidth = previewRef.current.querySelector( '*' ).offsetWidth;
			previewRef.current.style.transform = 'scale(' + ( 50 / attachmentWidth ) + ')';
		}
	}, [] );

	return (
		<Box sx={ {
			width: 50,
			height: 50,
			border: '1px solid gray',
			position: 'relative',
			cursor: 'pointer',
			overflow: 'hidden',
			opacity: props.disabled ? 0.5 : 1,
			'&:hover .remove-attachment': {
				display: 'block',
			},
		} } onClick={ props.onClick }
		>
			<IconButton
				className="remove-attachment"
				size="small"
				aria-label="close"
				disabled={ props.disabled }
				onClick={ props.onRemove }
				sx={ {
					display: 'none',
					position: 'absolute',
					insetInlineEnd: 0,
					backgroundColor: 'grey.200',
					zIndex: 1,
					'&:hover': {
						backgroundColor: 'grey.200',
					},
				} }
			>
				<XIcon />
			</IconButton>

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
	onRemove: PropTypes.func.isRequired,
	html: PropTypes.string.isRequired,
};
