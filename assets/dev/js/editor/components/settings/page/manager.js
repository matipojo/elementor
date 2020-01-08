import Component from './component';
import Document from 'elementor-document/document';

var BaseSettings = require( 'elementor-editor/components/settings/base/manager' );

module.exports = BaseSettings.extend( {
	onInit: function() {
		BaseSettings.prototype.onInit.apply( this );

		$e.components.register( new Component( { manager: this } ) );
	},

	save: function() {},

	changeCallbacks: {
		post_title: function( newValue ) {
			var $title = elementorFrontend.elements.$document.find( elementor.config.page_title_selector );

			$title.text( newValue );
		},

		template: function() {
			$e.run( 'document/save/auto', {
				force: true,
				options: {
					onSuccess: function() {
						elementor.reloadPreview();

						elementor.once( 'preview:loaded', function() {
							$e.route( 'panel/page-settings/settings' );
						} );
					},
				},
			} );
		},
	},

	onModelChange: function() {
		elementor.saver.setFlagEditorChange( true );

		BaseSettings.prototype.onModelChange.apply( this, arguments );
	},

	getDataToSave: function( data ) {
		data.id = elementor.config.document.id;

		return data;
	},

	// Emulate an element view/model structure with the parts needed for a container.
	getEditedView() {
		if ( this.editedView ) {
			return this.editedView;
		}

		const id = this.getContainerId(),
			editModel = new Backbone.Model( {
				id,
				elType: id,
				settings: this.model,
				elements: elementor.elements,
			} );

		const container = new elementorModules.editor.Container( {
			type: id,
			id: editModel.id,
			model: editModel,
			settings: editModel.get( 'settings' ),
			label: elementor.config.document.panel.title,
			controls: this.model.controls,
			renderer: false,
			children: elementor.elements,
		} );

		this.editedView = {
			getContainer: () => container,
			getEditModel: () => editModel,
			model: editModel,
		};

		return this.editedView;
	},

	getContainerId() {
		return 'document';
	},
} );
