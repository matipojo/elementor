import { Box } from '@elementor/ui';
import Logo from './components/logo';
import BusinessPreview from './previews/business-preview';

export default function Preview( { activeStep } ) {
	return (
		<Box sx={ { height: '100vh', backgroundColor: '#FFE1F9', p: 8 } } >
			<Logo />

			{ 0 === activeStep && <BusinessPreview /> }
		</Box>
	);
}
