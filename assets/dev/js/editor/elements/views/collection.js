var SectionView = require( 'elementor-elements/views/section' );

module.exports = SectionView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-elementor-container-content' ),

	className: function() {
		var classes = SectionView.prototype.className.apply( this, arguments );

		return classes + ' elementor-section elementor-collection-section elementor-inner-section';
	},

	onChildviewAfterWidgetAttachElContent: function( column, widget ) {
		var self = this,
			$cloned,
			clonedModel = widget.model.clone(),
			dynamic = clonedModel.get( 'settings' ).get( '__dynamic__' );

		var $ = elementorFrontend.getElements( 'window' ).jQuery;

		var renderWithTags = function( el ) {
			var data = widget.mixinTemplateHelpers( widget.serializeData() ),
				html = Marionette.Renderer.render( widget.getTemplate(), data, widget );

			// Restore original settings.
			widget.model.get( 'settings' ).set( '__dynamic__', dynamic, {
				silent: true,
			} );

			$( el ).removeClass( 'elementor-loading' ).empty().append( html );
		};

		$( '.elementor-element-' + widget.model.get( 'id' ) ).each( function( index ) {
			var widgetEl = this;
			if ( dynamic ) {
				var currentDynamic = {};

				_( dynamic ).each( function( value, key ) {
					var tagData = elementor.dynamicTags.tagTextToTagData( value );

					tagData.settings.collection = {
						id: self.model.get( 'id' ),
						index: index,
					};

					tagData.settings = new Backbone.Model( tagData.settings );

					currentDynamic[ key ] = elementor.dynamicTags.tagDataToTagText( tagData.id, tagData.name, tagData.settings );
				} );

				widget.model
					.get( 'settings' )
					.set( '__dynamic__', currentDynamic, {
						silent: true,
					} )
					.parseDynamicSettings( widget.model.get( 'settings' ), {
						onServerRequestEnd: function() {
							renderWithTags( widgetEl );
						},
					} );

				renderWithTags( widgetEl );
			} else {
				$cloned = $( widget.el ).clone( true, true );
				$( this ).empty().append( $cloned );
			}
		} );
	},

	childViewContainer: '.elementor-collection-item',

	initialize: function() {
		SectionView.prototype.initialize.apply( this, arguments );

		this.listenTo( this.collection, 'update', this.onCollectionUpdate );
	},

	onChildviewCollectionChange: function() {
		this.render();
	},

	onCollectionUpdate: function() {
		var self = this;
		_.delay( function() {
			if ( ! self.isDestroyed() ) {
				self.render();
			}
		}, 100 );
	},

	onChildviewWidgetAttachElContentAfter: function( view ) {
		// clone to all widgets on grid.
		var $ = elementorFrontend.getElements( 'window' ).jQuery,
			$cloned = $( view.el ).clone( true, true );
		$( '.elementor-element-' + view.model.get( 'id' ) ).not( view.el ).empty().append( $cloned );
	},
} );
