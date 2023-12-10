import { __ } from '@wordpress/i18n';
import {
	importToEditor,
	renderLayoutApp,
} from './utils/editor-integration';
import { MODE_LAYOUT } from './pages/form-layout/context/config';

export default class AiLayoutBehavior extends Marionette.Behavior {
	previewContainer = null;

	ui() {
		return {
			aiButton: '.e-ai-layout-button',
			addTemplateButton: '.elementor-add-template-button',
		};
	}

	events() {
		return {
			'click @ui.aiButton': 'onAiButtonClick',
		};
	}

	onAiButtonClick( e ) {
		e.stopPropagation();

		renderLayoutApp( {
			mode: MODE_LAYOUT,
			at: this.view.getOption( 'at' ),
			onInsert: this.onInsert.bind( this ),
			onRenderApp: ( args ) => {
				args.previewContainer.init();
			},
			onGenerate: ( args ) => {
				args.previewContainer.reset();
			},
		} );
	}

	hideDropArea() {
		this.view.onCloseButtonClick();
	}

	async onInsert( template ) {
		this.hideDropArea();

		try {
			// Import the template so the media files will be imported as well.
			const [ importedTemplate ] = await this.importTemplate( template );

			template = await this.getTemplateData(
				importedTemplate.source,
				importedTemplate.template_id,
			);
		} catch ( e ) {
			return Promise.reject( 'cannot_import_template' );
		}

		if ( ! template ) {
			return Promise.reject( 'imported_template_is_empty' );
		}

		importToEditor( {
			at: this.view.getOption( 'at' ),
			template,
			historyTitle: __( 'AI Layout', 'elementor' ),
		} );
	}

	onRender() {
		const $button = jQuery( '<div>', {
			class: 'e-ai-layout-button elementor-add-section-area-button e-button-primary',
			title: __( 'Build with AI', 'elementor' ),
			role: 'button',
		} );

		$button.html( `
			<div class="e-ai-layout-button--sparkle"></div>
			<div class="e-ai-layout-button--sparkle"></div>
			<div class="e-ai-layout-button--sparkle"></div>
			<div class="e-ai-layout-button--sparkle"></div>
			<div class="e-ai-layout-button--sparkle"></div>
			<div class="e-ai-layout-button--sparkle"></div>
			<div class="e-ai-layout-button--sparkle"></div>
			<i class="eicon-ai"></i>
		` );

		this.ui.addTemplateButton.after( $button );
	}

	importTemplate( template ) {
		const normalizedTemplate = {
			content: [ template ],
			type: template.elType || 'container', // `container` or `section`.
		};

		return new Promise( ( resolve, reject ) => {
			elementorCommon.ajax.addRequest( 'import_template', {
				success: resolve,
				error: reject,
				data: {
					fileName: 'ai-layout-template.json',
					// Needs to be a base64 encoded JSON.
					fileData: btoa( JSON.stringify( normalizedTemplate ) ),
				},
			} );
		} );
	}

	async getTemplateData( source, templateId ) {
		const data = await new Promise( ( resolve, reject ) => {
			$e.components.get( 'library' ).manager.requestTemplateContent( source, templateId, {
				success: resolve,
				error: reject,
			} );
		} );

		return data?.content?.[ 0 ] || null;
	}
}
