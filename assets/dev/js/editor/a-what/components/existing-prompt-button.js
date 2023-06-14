import { useSelector } from '@elementor/store';
import { selectElementResults } from '../store';
import React, { useEffect, useState } from 'react';
import { AIIcon } from '@elementor/icons';
import { Box, Portal } from '@elementor/ui';

export default function ExistingPromptButton( { elementId, setElementId } ) {
	const results = useSelector( ( state ) => selectElementResults( state, elementId ) );
	const [ element, setElement ] = useState( null );

	useEffect( () => {
		let container = window.elementor.getContainer( elementId );
		const previewContainer = elementor.getPreviewContainer();

		const { content: [ model ] } = window.elementor.html4Parser.parse(
			results.current?.result || '<row></row>',
			elementId || null,
		);

		let at = null;

		if ( container ) {
			at = previewContainer.children.findIndex( ( child ) => child === container );

			$e.run( 'document/elements/delete', { container } );
		}

		container = $e.run( 'document/elements/create', {
			container: previewContainer,
			model,
			options: { at, edit: false },
		} );

		setElement( container.view.$el.get( 0 ) );
	}, [ results.current?.id ] );

	return (
		<>
			{
				element
					? <Portal container={ element } key={ elementId }>
						<Box style={ { position: 'absolute', top: '10px', left: '10px' } } class="ai-element-button">
							<button
								className="elementor-add-section-area-button e-block-ai-button"
								title="Generate with AI"
								onClick={ () => setElementId( elementId ) }
								style={ { width: '32px', height: '32px', padding: '10px' } }
							>
								<AIIcon fill="white" />
							</button>
						</Box>
					</Portal>
					: null
			}
		</>
	);
}
