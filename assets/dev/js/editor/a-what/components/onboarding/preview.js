import { Box } from '@elementor/ui';
import Logo from './components/logo';
import BusinessPreview from './previews/business-preview';
import BlocksPreview from './previews/blocks-preview';
import StylePreview from './previews/style-preview';

export default function Preview( { activeStep, data } ) {
	return (
		<Box sx={ { height: '100vh', backgroundColor: '#F6C8F0', px: 8, pt: 8 } } >
			<Logo />

			<Box position="sticky" top="100%">
				{ 0 === activeStep && <BusinessPreview data={ data } /> }
				{ 1 === activeStep && <BlocksPreview data={ data } /> }
				{ 2 === activeStep && <StylePreview data={ data } /> }
			</Box>
		</Box>
	);
}
