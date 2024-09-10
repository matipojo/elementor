import { Alert, Box, Button, Stack, Typography } from '@elementor/ui';
import { __ } from '@wordpress/i18n';
import LockIcon from '../../../icons/lock-icon';
import useIntroduction from '../../../hooks/use-introduction';
import { createProPricingUrl } from '../../../helpers/utm';
import useUserInfo from '../../../hooks/use-user-info';

export const ProWidgetsNotice = () => {
	const { isViewed, markAsViewed } = useIntroduction( 'e-ai-builder-pro-widget' );
	const { hasSubscription, isLoaded } = useUserInfo();

	if ( isViewed || ! isLoaded ) {
		return null;
	}

	return (
		<Box
			sx={ {
				pt: 2,
				px: 2,
				pb: 0,
			} }
		>
			<Alert
				severity="info"
				variant="filled"
				color="promotion"
				onClose={ () => markAsViewed( ) }
				icon={ <LockIcon /> }
				sx={ {
					'& .MuiAlert-message': {
						width: '100%',
					},
				} }
			>
				<Stack
					flexDirection="row"
					alignItems="baseline"
					justifyContent="space-between"
				>
					<Typography
						variant="body2"
						component="span"
						sx={ {
							paddingInlineEnd: 0.5,
						} }
					>
						<Typography
							variant="subtitle2"
							component="span"
							sx={ {
								paddingInlineEnd: 1,
							} }
						>
							{ __( 'Upgrade your plan for best results.', 'elementor' ) }
						</Typography>

						{ __( 'You won’t be able to use layouts with Elementor Pro widgets until you do.', 'elementor' ) }
					</Typography>
					<Button
						variant="outlined"
						size="small"
						onClick={ () => window.open( createProPricingUrl( {
							utm_content: `pro-notice-${ hasSubscription ? 'paid' : 'free' }`,
						} ), '_blank' ) }
						color="inherit"
					>
						{ __( 'Go Pro', 'elementor' ) }
					</Button>
				</Stack>

			</Alert>
		</Box>
	);
};
