
import { Box } from '@elementor/ui';

export default function BlocksPreview() {
	return (
		<Box width="100%" maxWidth="680px" margin="0 auto">
			<img src={ `${ elementorCommonConfig.urls.assets }images/ai/ai-blocks.png` } alt="Business Preview" width="100%" />
		</Box>
	);
}
