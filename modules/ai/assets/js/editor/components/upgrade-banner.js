import { Alert, AlertAction } from '@elementor/ui';
import { createPricingUrl } from '../helpers/utm';

const UpgradeBanner = ( { onClose, featureId, ...props } ) => {
	return (
		<Alert
			icon={ false }
			action={ (
				<AlertAction
					onClick={ () => window.open( createPricingUrl( {
						utm_term: featureId,
						utm_content: 'free-upgrade',
					} ), '_blank' ) }
				>
					{ __( 'Upgrade', 'elementor' ) }
				</AlertAction>
			) }
			variant="filled"
			color="promotion"
			onClose={ onClose }
			{ ...props }
		>
			{ __( 'You’re using a limited license. Get maximum access to Elementor AI.', 'elementor' ) }
		</Alert>
	);
};

UpgradeBanner.propTypes = {
	onClose: PropTypes.func,
	sx: PropTypes.object,
	featureId: PropTypes.string,
};

export default UpgradeBanner;
