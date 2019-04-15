var BaseSettings = require( 'elementor-editor/components/settings/base/manager' );

module.exports = BaseSettings.extend( {

	onElementorPreviewLoaded: function() {
		BaseSettings.prototype.onElementorPreviewLoaded.apply( this, arguments );

		// Add id & documentView to handle `$e() || $e( '#document' )` wrapper.
		this.model.id = 'document';

		elementor.documentView = {
			$el: elementor.$previewElementorEl,
			children: elementor.getPreviewView().children,
			getEditModel: () => elementor.documentView.model,
			addChildElement: function( element, args ) {
				return elementor.getPreviewView().addChildElement( element, args );
			},
			model: new Backbone.Model( {
				id: 'document',
				elType: 'document',
				settings: this.model,
			} ),
		};

		this.model._parent = elementor.documentView;
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
						elementorCommon.route.to( 'panel/page/settings' );
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
