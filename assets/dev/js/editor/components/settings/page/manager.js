import Component from './component';

var BaseSettings = require( 'elementor-editor/components/settings/base/manager' );

module.exports = BaseSettings.extend( {
	getStyleId: function() {
		return this.getSettings( 'name' ) + '-' + elementor.documents.getCurrent().id;
	},

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
				onSuccess: function() {
					elementor.reloadPreview();

					elementor.once( 'preview:loaded', function() {
						$e.route( 'panel/page-settings/settings' );
					} );
				},
			} );
		},
	},

	onModelChange: function() {
		$e.internal( 'document/save/set-is-modified', { status: true } );

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
			children: elementor.elements,
		} );

		this.editedView = {
			getContainer: () => container,
			getEditModel: () => editModel,
			model: editModel,
		};

		// Emulate a view that can render the style.
		container.renderer = {
			view: {
				lookup: () => container,
				renderOnChange: () => this.updateStylesheet(),
			},
		};

		return this.editedView;
	},

	getContainerId() {
		return 'document';
	},
} );
