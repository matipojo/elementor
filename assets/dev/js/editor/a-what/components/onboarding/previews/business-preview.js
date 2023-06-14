import { Box } from '@elementor/ui';

export default function BusinessPreview() {
	return (
		<Box width="100%" maxWidth="680px" margin="0 auto">
			<img src={ `${ elementorCommonConfig.urls.assets }images/ai/ai-business.png` } alt="Business Preview" width="100%" />
		</Box>
	);
}
