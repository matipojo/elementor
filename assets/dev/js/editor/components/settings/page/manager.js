var BaseSettings = require( 'elementor-editor/components/settings/base/manager' );

module.exports = BaseSettings.extend( {

	onElementorPreviewLoaded: function() {
		BaseSettings.prototype.onElementorPreviewLoaded.apply( this, arguments );

		// Add a reference to the settings model for the $e() wrapper.
		elementor.sections.currentView.model.set( 'settings', this.model );
		elementor.elementsModel.set( 'settings', this.model );
	},

	save: function() {},

	changeCallbacks: {
		post_title: function( newValue ) {
			var $title = elementorFrontend.elements.$document.find( elementor.config.page_title_selector );

			$title.text( newValue );
		},

		template: function() {
			elementor.saver.saveAutoSave( {
				onSuccess: function() {
					elementor.reloadPreview();

					elementor.once( 'preview:loaded', function() {
						elementorCommon.route.to( 'panel/page-settings' );
					} );
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
} );
