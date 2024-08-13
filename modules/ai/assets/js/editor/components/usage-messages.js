import UpgradeBanner from './upgrade-banner';
import UsageLimitAlert from './usage-limit-alert';
import useUpgradeMessage from '../hooks/use-upgrade-message';

const UsageMessages = ( { hasSubscription, usagePercentage, sx, featureId } ) => {
	const { showBanner, markBannerAsViewed } = useUpgradeMessage( { usagePercentage, hasSubscription } );

	return (
		<>
			{ showBanner && <UpgradeBanner featureId={ featureId } onClose={ markBannerAsViewed } sx={ sx } /> }
			<UsageLimitAlert hasSubscription={ hasSubscription } usagePercentage={ usagePercentage } sx={ sx } featureId={ featureId } />
		</>
	);
};

UsageMessages.propTypes = {
	hasSubscription: PropTypes.bool,
	usagePercentage: PropTypes.number,
	sx: PropTypes.object,
	featureId: PropTypes.string,
};

export default UsageMessages;
