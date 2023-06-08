import React, { useRef } from 'react';
import { Portal } from '@elementor/ui';
import { AIIcon } from '@elementor/icons';

export default function GenerateWithAiButton() {
	const ref = useRef( document.querySelector( '.elementor-add-section-inner' ) );

	return (
		<Portal container={ item } key={ index }>
			<button className="elementor-add-section-area-button e-block-ai-button" title="Generate with AI">
				<AIIcon />
			</button>
		</Portal>
	);
}
