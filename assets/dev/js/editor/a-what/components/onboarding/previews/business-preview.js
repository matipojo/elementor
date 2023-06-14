import { useState, useEffect } from 'react';
import { Box, Fade } from '@elementor/ui';

const imageUrl = `${ elementorCommonConfig.urls.assets }images/ai/ai-business.png`;

export default function BusinessPreview() {
	const [ show, setShow ] = useState( false );

	useEffect( () => {
		const img = new Image();

		img.src = imageUrl;

		img.onload = () => setShow( true );
	}, [] );

	return (
		<Box width="100%" maxWidth="680px" margin="0 auto">
			<Fade in={ show }>
				<img src={ imageUrl } alt="Business Preview" width="100%" />
			</Fade>
		</Box>
	);
}
