import { __useActiveDocument as useActiveDocument } from '@elementor/editor-documents';
import { EyeIcon } from '@elementor/icons';
import { __ } from '@wordpress/i18n';

export default function useDocumentViewAsMarkdownProps() {
	const document = useActiveDocument();

	return {
		icon: EyeIcon,
		title: __( 'View as Markdown', 'elementor' ),
		onClick: () => {
			if ( ! document?.links?.permalink ) {
				return;
			}

			const separator = document.links.permalink.includes( '?' ) ? '&' : '?';
			const url = document.links.permalink + separator + 'format=markdown';

			window.open( url, '_blank' );
		},
	};
}
