var SectionView = require( 'elementor-elements/views/section' );

module.exports = SectionView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-elementor-flex_container-content' ),

	className: function() {
		var classes = SectionView.prototype.className.apply( this, arguments );

		return classes + ' elementor-section elementor-flex-container elementor-inner-section';
	},
} );
