import { useSelector } from '@elementor/store';
import { selectElementResults } from '../store';
import { useEffect } from 'react';

export default function ExistingPromptButton( { elementId } ) {
	const results = useSelector( ( state ) => selectElementResults( state, elementId ) );

	useEffect( () => {
		const container = window.elementor.getContainer( elementId );
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

		$e.run( 'document/elements/create', {
			container: previewContainer,
			model,
			options: { at },
		} );

		console.log( ! container ? `${ elementId } created` : `${ elementId } updated` );
	}, [ results.current?.id ] );

	// TODO: Here should be a portal to the element with button to open the prompt modal.
	return null;
}
