import { Button, Stack, Typography } from '@elementor/ui';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { UpgradeIcon } from '@elementor/icons';
import { getTranslatedPromptHistoryType, HISTORY_TYPES } from '../history-types';
import useUserInfo from '../../../hooks/use-user-info';
import { createPricingUrl, createUpgradeUrl } from '../../../helpers/utm';

const VARIANT_FULL = 'full';
const VARIANT_SMALL = 'small';

const messages = {
	// Translators: %s: History type.
	[ VARIANT_FULL ]: __( 'Want to see your %s generation history for as far as the past 90 days?', 'elementor' ),
	// Translators: %s: History type.
	[ VARIANT_SMALL ]: __( 'Want to see your %s generation history for the past 90 days?', 'elementor' ),
};

const getMessage = ( variant, historyType ) => {
	const placeholder = messages[ variant ] || messages[ VARIANT_FULL ];
	const translatedHistoryType = getTranslatedPromptHistoryType( historyType );

	return sprintf( placeholder, translatedHistoryType );
};

const PromptHistoryUpgrade = ( { variant, historyType } ) => {
	const { hasSubscription, isLoaded } = useUserInfo( true );

	if ( ! isLoaded ) {
		return null;
	}

	let actionUrl;
	if ( hasSubscription ) {
		actionUrl = createUpgradeUrl( {
			utm_term: historyType,
			utm_content: 'ai-history-cta',
		} );
	} else {
		actionUrl = createPricingUrl( {
			utm_term: historyType,
			utm_content: 'ai-history-cta',
		} );
	}

	return (
		<Stack
			justifyContent="center"
			sx={ { height: VARIANT_SMALL === variant ? 'auto' : '100%', textAlign: 'center', p: 2 } }
			data-testid={ `e-ph-upgrade-${ variant }` }>
			<Typography variant="body1" sx={ { marginBottom: 2 } }>
				{ getMessage( variant, historyType ) }
			</Typography>

			<Button
				variant="contained"
				color="promotion"
				size="small"
				href={ actionUrl }
				target="_blank"
				rel="noopener noreferrer"
				startIcon={ <UpgradeIcon /> }
				sx={ {
					width: '50%',
					alignSelf: 'center',

					'&:hover': {
						color: 'promotion.contrastText',
					},
				} }
			>
				{ __( 'Upgrade now', 'elementor' ) }
			</Button>
		</Stack>
	);
};

PromptHistoryUpgrade.propTypes = {
	variant: PropTypes.oneOf( [ VARIANT_FULL, VARIANT_SMALL ] ).isRequired,
	historyType: PropTypes.oneOf( Object.values( HISTORY_TYPES ) ).isRequired,
};

export default PromptHistoryUpgrade;
