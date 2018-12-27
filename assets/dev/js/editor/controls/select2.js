var ControlBaseDataView = require( 'elementor-controls/base-data' ),
	ControlSelect2ItemView;

ControlSelect2ItemView = ControlBaseDataView.extend( {
	getSelect2Placeholder: function() {
		return this.ui.select.children( 'option:first[value=""]' ).text();
	},

	getSelect2DefaultOptions: function() {
		return {
			allowClear: true,
			placeholder: this.getSelect2Placeholder(),
			dir: elementorCommon.config.isRTL ? 'rtl' : 'ltr',
		};
	},

	onBeforeRender: function() {
		var options = this.model.get( 'options' ),
			value = this.getControlValue();

		if ( ! _.isArray( value ) ) {
			value = [value];
		}

		_.each( value, function( id ) {
			if ( id && ! options[ id ] ) {
				options[ id ] = elementor.translate( 'unknown_value' )  + ' (' + id + ')';
			}
		} );

		this.model.set( 'options', options );
	},

	getSelect2Options: function() {
		return jQuery.extend( this.getSelect2DefaultOptions(), this.model.get( 'select2options' ) );
	},

	onReady: function() {
		this.ui.select.select2( this.getSelect2Options() );
	},

	onBeforeDestroy: function() {
		if ( this.ui.select.data( 'select2' ) ) {
			this.ui.select.select2( 'destroy' );
		}

		this.$el.remove();
	},
} );

module.exports = ControlSelect2ItemView;
