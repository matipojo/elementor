module.exports = elementorModules.editor.views.ControlsStack.extend( {
	id: function() {
		return 'elementor-panel-' + this.getOption( 'name' ) + '-settings';
	},

	getTemplate: function() {
		return '#tmpl-elementor-panel-' + this.getOption( 'name' ) + '-settings';
	},

	childViewContainer: function() {
		return '#elementor-panel-' + this.getOption( 'name' ) + '-settings-controls';
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model,
			elementEditSettings: this.model.get( 'editSettings' ),
		};
	},

	initialize: function() {
		elementorModules.editor.views.ControlsStack.prototype.initialize.apply( this, arguments );
		this.initEditSettings();
	},

	initEditSettings: function() {
		var editSettings = new Backbone.Model( this.model.get( 'defaultEditSettings' ) );

		this.model.set( 'editSettings', editSettings );
	},
} );
