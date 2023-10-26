import { Box, Stack, Typography } from '@elementor/ui';
import PropTypes from 'prop-types';

export const MenuItem = ( props ) => {
	return (
		<Stack
			direction="row"
			spacing={ 1 }
			sx={ {
				cursor: 'pointer',
				alignItems: 'center',
				p: 2,
			} }
			variant="body2"
			onClick={ props.onClick }
		>
			<Box
				sx={ {
					height: 18,
				} }
			>
				{ props.icon }
			</Box>
			<Typography>
				{ props.title }
			</Typography>
		</Stack>
	);
};

MenuItem.propTypes = {
	title: PropTypes.string,
	icon: PropTypes.node,
	onClick: PropTypes.func,
};
