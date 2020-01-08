export default class extends Marionette.Behavior {
	events() {
		return {
			resizestart: 'onResizeStart',
			resizestop: 'onResizeStop',
			resize: 'onResize',
		};
	}

	initialize() {
		super.initialize();

		this.listenTo( elementor.channels.dataEditMode, 'switch', this.toggle );

		// Save this instance for external use eg: ( hooks ).
		this.view.options.resizeable = this;
	}

	activate() {
		this.$el.resizable( {
			handles: 'e, w',
		} );
	}

	deactivate() {
		if ( ! this.$el.resizable( 'instance' ) ) {
			return;
		}

		this.$el.resizable( 'destroy' );
	}

	toggle() {
		const editModel = this.view.getEditModel(),
			isAbsolute = editModel.getSetting( '_position' ),
			isInline = 'initial' === editModel.getSetting( '_element_width' );

		this.deactivate();

		if ( ( isAbsolute || isInline ) && this.view.container.isDesignable() ) {
			this.activate();
		}
	}

	onRender() {
		_.defer( () => this.toggle() );
	}

	onDestroy() {
		this.deactivate();
	}

	onResizeStart( event ) {
		event.stopPropagation();

		this.view.model.trigger( 'request:edit' );
	}

	onResizeStop( event, ui ) {
		event.stopPropagation();

		const currentDeviceMode = elementorFrontend.getCurrentDeviceMode(),
			deviceSuffix = 'desktop' === currentDeviceMode ? '' : '_' + currentDeviceMode,
			editModel = this.view.getEditModel(),
			unit = editModel.getSetting( '_element_custom_width' + deviceSuffix ).unit,
			width = elementor.helpers.elementSizeToUnit( this.$el, ui.size.width, unit ),
			settingToChange = {};

		settingToChange[ '_element_width' + deviceSuffix ] = 'initial';
		settingToChange[ '_element_custom_width' + deviceSuffix ] = { unit: unit, size: width };

		$e.run( 'document/elements/settings', {
			container: this.view.container,
			settings: settingToChange,
			options: {
				external: true,
			},
		} );

		this.$el.css( {
			width: '',
			height: '',
			left: '',
		} );
	}

	onResize( event ) {
		event.stopPropagation();
	}
}
