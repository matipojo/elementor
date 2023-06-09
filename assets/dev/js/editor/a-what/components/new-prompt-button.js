import React, { useState } from 'react';
import { Portal } from '@elementor/ui';
import { AIIcon } from '@elementor/icons';
import { useListenTo, windowEvent } from '@elementor/editor-v1-adapters';

export default function NewPromptButton( { onClick } ) {
	const [ elements, setElements ] = useState( [] );

	useListenTo(
		windowEvent( 'elementor/add-new-section' ),
		() => {
			const iframe = document.querySelector( '#elementor-preview-iframe' );

			setElements( [ ...iframe.contentWindow.document.querySelectorAll( '.elementor-add-section-inner' ) ] || [] );
		},
	);

	return (
		<>
			{ elements.map( ( element, index ) => (
				<Portal container={ element } key={ index }>
					<button
						className="elementor-add-section-area-button e-block-ai-button"
						title="Generate with AI"
						style={ { marginLeft: '10px' } }
						onClick={ onClick }
					>
						<AIIcon fill="white" />
					</button>
				</Portal>
			) ) }
		</>
	);
}
