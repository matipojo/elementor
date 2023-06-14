import { useState, useEffect } from 'react';
import { Box, Fade } from '@elementor/ui';

const imageUrl = `${ elementorCommonConfig.urls.assets }images/ai/ai-blocks.png`;
const imageUrl2 = `${ elementorCommonConfig.urls.assets }images/ai/ai-blocks2.png`;

export default function BlocksPreview( { data } ) {
	const [ showFirst, setShowFirst ] = useState( false );
	const [ showSecond, setShowSecond ] = useState( false );

	useEffect( () => {
		const img1 = new Image();
		const img2 = new Image();

		img1.src = imageUrl;
		img2.src = imageUrl;

		img1.onload = () => setShowFirst( true );
		img2.onload = () => {};
	}, [] );

	useEffect( () => {
		if ( data.sections[ 1 ].value ) {
			setShowFirst( false );
			setShowSecond( true );
		}
	}, [ data.sections[ 1 ].value ] );

	return (
		<Box width="100%" maxWidth="680px" margin="0 auto">
			<Box position="relative">
				<Fade in={ showFirst }>
					<img src={ imageUrl } alt="Business Preview" width="100%" style={ { position: 'relative' } } />
				</Fade>

				<Fade in={ showSecond }>
					<img src={ imageUrl2 } alt="Business Preview" width="100%" style={ { position: 'absolute', top: 0, left: 0 } } />
				</Fade>
			</Box>
		</Box>
	);
}
