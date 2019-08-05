var ControlBaseDataView = require( 'elementor-controls/base-data' ),
	RepeaterRowView;

RepeaterRowView = Marionette.CompositeView.extend( {
	getTemplate: () => {
		let template;
		try {
			template = Marionette.TemplateCache.get( '#tmpl-elementor-repeater-row' );
		} catch ( e ) {
			// Do nothing.
		}
		return template;
	},

	className: 'elementor-repeater-fields',

	ui: {
		duplicateButton: '.elementor-repeater-tool-duplicate',
		editButton: '.elementor-repeater-tool-edit',
		removeButton: '.elementor-repeater-tool-remove',
		itemTitle: '.elementor-repeater-row-item-title',
	},

	behaviors: {
		HandleInnerTabs: {
			behaviorClass: require( 'elementor-behaviors/inner-tabs' ),
		},
	},

	triggers: {
		'click @ui.removeButton': 'click:remove',
		'click @ui.duplicateButton': 'click:duplicate',
		'click @ui.itemTitle': 'click:edit',
	},

	modelEvents: {
		change: 'onModelChange',
	},

	templateHelpers: function() {
		return {
			itemIndex: this.getOption( 'itemIndex' ),
			itemActions: this.getOption( 'itemActions' ),
		};
	},

	childViewContainer: '.elementor-repeater-row-controls',

	getChildView: function( item ) {
		var controlType = item.get( 'type' );

		return elementor.getControlView( controlType );
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model,
		};
	},

	updateIndex: function( newIndex ) {
		this.itemIndex = newIndex;
	},

	setTitle: function() {
		var titleField = this.getOption( 'titleField' ),
			title = '';

		if ( titleField ) {
			var values = {};

			this.children.each( function( child ) {
				if ( ! ( child instanceof ControlBaseDataView ) ) {
					return;
				}

				values[ child.model.get( 'name' ) ] = child.getControlValue();
			} );

			title = Marionette.TemplateCache.prototype.compileTemplate( titleField )( this.model.parseDynamicSettings() );
		}

		if ( ! title ) {
			title = elementor.translate( 'Item #%s', [ this.getOption( 'itemIndex' ) ] );
		}

		this.ui.itemTitle.html( title );
	},

	initialize: function( options ) {
		this.itemIndex = 0;

		// Collection for Controls list
		this.collection = new Backbone.Collection( _.values( elementor.mergeControlsSettings( options.controlFields ) ) );
	},

	onRender: function() {
		this.setTitle();

		this.children.each( ( view ) => {
			view.setSettingsModel = this.setSettingsModel;
		} );
	},

	onModelChange: function() {
		if ( this.getOption( 'titleField' ) ) {
			this.setTitle();
		}
	},

	onChildviewResponsiveSwitcherClick: function( childView, device ) {
		if ( 'desktop' === device ) {
			elementor.getPanelView().getCurrentPageView().$el.toggleClass( 'elementor-responsive-switchers-open' );
		}
	},

	setSettingsModel: function( value ) {
		const controlName = this.elementSettingsModel.control.model.get( 'name' ),
			newSettings = {};
		newSettings[ this.model.get( 'name' ) ] = value;

		const $eElement = $e( '#' + this.elementSettingsModel.control._parent.model.id );

		$eElement.get( controlName ).getItem( this._parent._index ).settings( newSettings );
	},
} );

module.exports = RepeaterRowView;
