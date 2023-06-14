// Most of the code has been copied from `section.js`.
import AddSectionView from 'elementor-views/add-section/inline';
import WidgetResizable from './behaviors/widget-resizeable';
import ContainerHelper from 'elementor-editor-utils/container-helper';
import EmptyView from 'elementor-elements/views/container/empty-view';
import { SvgIcon } from '@elementor/ui';
import * as React from 'react';

const BaseElementView = require( 'elementor-elements/views/base' );
const ContainerView = BaseElementView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-elementor-container-content' ),

	emptyView: EmptyView,

	destroyEmptyView() {
		// Do not remove the empty view for Grid Containers.
		if ( this.isFlexContainer() ) {
			return Marionette.CompositeView.prototype.destroyEmptyView.apply( this, arguments );
		}
	},

	getChildViewContainer() {
		this.childViewContainer = this.isBoxedWidth()
			? '> .e-con-inner'
			: '';

		return Marionette.CompositeView.prototype.getChildViewContainer.apply( this, arguments );
	},

	className() {
		return `${ BaseElementView.prototype.className.apply( this ) } e-con`;
	},

	childViewOptions() {
		return {
			emptyViewOwner: this,
		};
	},

	tagName() {
		return this.model.getSetting( 'html_tag' ) || 'div';
	},

	// TODO: Copied from `views/column.js`.
	ui() {
		var ui = BaseElementView.prototype.ui.apply( this, arguments );

		ui.percentsTooltip = '> .elementor-element-overlay .elementor-column-percents-tooltip';

		return ui;
	},

	getCurrentUiStates() {
		const currentDirection = this.container.settings.get( this.getDirectionSettingKey() );

		return {
			directionMode: currentDirection || ContainerHelper.DIRECTION_DEFAULT,
		};
	},

	getDirectionSettingKey() {
		const containerType = this.container.settings.get( 'container_type' ),
			directionSettingKey = 'grid' === containerType
				? 'grid_auto_flow'
				: 'flex_direction';

		return directionSettingKey;
	},

	behaviors() {
		const behaviors = BaseElementView.prototype.behaviors.apply( this, arguments );

		_.extend( behaviors, {
			// TODO: Remove. It's a temporary solution for the Navigator sortable.
			Sortable: {
				behaviorClass: require( 'elementor-behaviors/sortable' ),
				elChildType: 'widget',
			},
			Resizable: {
				behaviorClass: WidgetResizable,
			},
		} );

		return elementor.hooks.applyFilters( 'elements/container/behaviors', behaviors, this );
	},

	initialize() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		this.model.get( 'editSettings' ).set( 'defaultEditRoute', 'layout' );
	},

	/**
	 * TODO: Remove. It's a temporary solution for the Navigator sortable.
	 *
	 * @return {{}} options
	 */
	getSortableOptions() {
		// TODO: Temporary hack.
		return {
			preventInit: true,
		};
	},

	/**
	 * Get the Container nesting level recursively.
	 * The farthest parent Container is level 0.
	 *
	 * @return {number} nesting level
	 */
	getNestingLevel() {
		// Use the memoized value if present, to prevent too many calculations.
		if ( this.nestingLevel ) {
			return this.nestingLevel;
		}

		const parent = this.container.parent;

		// Start counting nesting level only from the closest Container parent.
		if ( 'container' !== parent.type ) {
			return 0;
		}

		return parent.view.getNestingLevel() + 1;
	},

	getDroppableAxis() {
		const isColumnDefault = ( ContainerHelper.DIRECTION_DEFAULT === ContainerHelper.DIRECTION_COLUMN ),
			currentDirection = this.getContainer().settings.get( this.getDirectionSettingKey() );

		const axisMap = {
			[ ContainerHelper.DIRECTION_COLUMN ]: 'vertical',
			[ ContainerHelper.DIRECTION_COLUMN_REVERSED ]: 'vertical',
			[ ContainerHelper.DIRECTION_ROW ]: 'horizontal',
			[ ContainerHelper.DIRECTION_ROW_REVERSED ]: 'horizontal',
			'': isColumnDefault ? 'vertical' : 'horizontal',
		};

		return axisMap[ currentDirection ];
	},

	getDroppableOptions() {
		const items = this.isBoxedWidth()
			? '> .elementor-widget, > .e-con-full, > .e-con > .e-con-inner, > .elementor-empty-view > .elementor-first-add'
			: '> .elementor-element, > .elementor-empty-view .elementor-first-add';

		return {
			axis: this.getDroppableAxis(),
			items,
			groups: [ 'elementor-element' ],
			horizontalThreshold: 5, // TODO: Stop the magic.
			isDroppingAllowed: this.isDroppingAllowed.bind( this ),
			currentElementClass: 'elementor-html5dnd-current-element',
			placeholderClass: 'elementor-sortable-placeholder elementor-widget-placeholder',
			hasDraggingOnChildClass: 'e-dragging-over',
			getDropContainer: () => this.getContainer(),
			onDropping: ( side, event ) => {
				event.stopPropagation();

				// Triggering drag end manually, since it won't fired above iframe
				elementor.getPreviewView().onPanelElementDragEnd();

				const draggedView = elementor.channels.editor.request( 'element:dragged' ),
					draggingInSameParent = ( draggedView?.parent === this ),
					hasInnerContainer = jQuery( event.currentTarget ).hasClass( 'e-con-inner' ),
					containerSelector = hasInnerContainer ? event.currentTarget.parentElement.parentElement : event.currentTarget.parentElement;

				let $elements = jQuery( containerSelector ).find( '> .elementor-element' );

				// Exclude the dragged element from the indexing calculations.
				if ( draggingInSameParent ) {
					$elements = $elements.not( draggedView.$el );
				}

				const widgetsArray = Object.values( $elements );

				let newIndex = hasInnerContainer ? widgetsArray.indexOf( event.currentTarget.parentElement ) : widgetsArray.indexOf( event.currentTarget );

				// Plus one in order to insert it after the current target element.
				if ( this.shouldIncrementIndex( side ) ) {
					newIndex++;
				}

				// User is sorting inside a Container.
				if ( draggedView ) {
					// Prevent the user from dragging a parent container into its own child container
					const draggedId = draggedView.getContainer().id;

					let currentTargetParentContainer = this.container;

					while ( currentTargetParentContainer ) {
						if ( currentTargetParentContainer.id === draggedId ) {
							return;
						}

						currentTargetParentContainer = currentTargetParentContainer.parent;
					}

					// Reset the dragged element cache.
					elementor.channels.editor.reply( 'element:dragged', null );

					$e.run( 'document/elements/move', {
						container: draggedView.getContainer(),
						target: this.getContainer(),
						options: {
							at: newIndex,
						},
					} );

					return;
				}

				// User is dragging an element from the panel.
				this.onDrop( event, { at: newIndex } );
			},
		};
	},

	/**
	 * Save container as a template.
	 *
	 * @return {void}
	 */
	saveAsTemplate() {
		$e.route( 'library/save-template', {
			model: this.model,
		} );
	},

	/**
	 * Insert a new container inside an existing container.
	 *
	 * @since 3.7.0
	 *
	 * @return {void}
	 */
	addNewContainer() {
		/* Check if the current container has a parent container */
		const containerAncestry = this.getContainer().getParentAncestry(),
			targetContainer = ( 'container' !== containerAncestry[ 1 ].type ) ? this.getContainer() : this.getContainer().parent;

		$e.run( 'document/elements/create', {
			model: {
				elType: 'container',
				settings: {
					content_width: 'full',
				},
			},
			container: targetContainer,
		} );
	},

	/**
	 * Add a `Save as Template` button to the context menu.
	 *
	 * @return {Object} groups
	 *
	 */
	getContextMenuGroups() {
		var groups = BaseElementView.prototype.getContextMenuGroups.apply( this, arguments ),
			transferGroupClipboardIndex = groups.indexOf( _.findWhere( groups, { name: 'clipboard' } ) ),
			transferGroupGeneralIndex = groups.indexOf( _.findWhere( groups, { name: 'general' } ) );

		groups.splice( transferGroupClipboardIndex + 1, 0, {
			name: 'save',
			actions: [
				{
					name: 'save',
					title: __( 'Save as Template', 'elementor' ),
					callback: this.saveAsTemplate.bind( this ),
					isEnabled: () => ! this.getContainer().isLocked(),
				},
			],
		} );

		groups.splice( transferGroupGeneralIndex + 1, 0, {
			name: 'newContainerGroup',
			actions: [
				{
					name: 'newContainer',
					icon: 'eicon-plus',
					title: __( 'Add New Container', 'elementor' ),
					callback: this.addNewContainer.bind( this ),
				},
			],
		} );

		return groups;
	},

	isDroppingAllowed() {
		// Don't allow dragging items to document which is not editable.
		if ( ! this.getContainer().isEditable() ) {
			return false;
		}

		const elementView =
			elementor.channels.panelElements.request( 'element:selected' ) ||
			elementor.channels.editor.request( 'element:dragged' );

		if ( ! elementView ) {
			return false;
		}

		return [ 'widget', 'container' ].includes( elementView.model.get( 'elType' ) );
	},

	/**
	 * Determine if the current container is a nested container.
	 *
	 * @return {boolean} is a nested container
	 */
	isNested() {
		return 'document' !== this.getContainer().parent.model.get( 'elType' );
	},

	getEditButtons() {
		const elementData = elementor.getElementData( this.model ),
			editTools = {};

		editTools.add = {
			/* Translators: %s: Element Name. */
			title: sprintf( __( 'Add %s', 'elementor' ), elementData.title ),
			icon: 'plus',
		};

		editTools.edit = {
			/* Translators: %s: Element Name. */
			title: sprintf( __( 'Edit %s', 'elementor' ), elementData.title ),
			icon: 'handle',
		};

		if ( ! this.getContainer().isLocked() ) {
			if ( elementor.getPreferences( 'edit_buttons' ) ) {
				editTools.duplicate = {
					/* Translators: %s: Element Name. */
					title: sprintf( __( 'Duplicate %s', 'elementor' ), elementData.title ),
					icon: 'clone',
				};
			}

			editTools.remove = {
				/* Translators: %s: Element Name. */
				title: sprintf( __( 'Delete %s', 'elementor' ), elementData.title ),
				icon: 'close',
			};
		}

		return editTools;
	},

	/**
	 * Toggle the `New Section` view when clicking the `add` button in the edit tools.
	 *
	 * @return {void}
	 *
	 */
	onAddButtonClick() {
		if ( this.addSectionView && ! this.addSectionView.isDestroyed ) {
			this.addSectionView.fadeToDeath();

			return;
		}

		const addSectionView = new AddSectionView( {
			at: this.model.collection.indexOf( this.model ),
		} );

		addSectionView.render();

		this.$el.before( addSectionView.$el );

		addSectionView.$el.hide();

		// Delaying the slide down for slow-render browsers (such as FF)
		setTimeout( function() {
			addSectionView.$el.slideDown( null, function() {
				// Remove inline style, for preview mode.
				jQuery( this ).css( 'display', '' );
			} );
		} );

		this.addSectionView = addSectionView;
	},

	onRender() {
		BaseElementView.prototype.onRender.apply( this, arguments );

		// Defer to wait for everything to render.
		setTimeout( () => {
			this.nestingLevel = this.getNestingLevel();
			this.$el[ 0 ].dataset.nestingLevel = this.nestingLevel;

			// Add the EmptyView to the end of the Grid Container on initial page load if there are already some widgets.
			if ( this.isGridContainer() ) {
				this.reInitEmptyView();
			}

			this.droppableInitialize( this.container.settings );

			//
			if ( 0 === this.nestingLevel ) {
				const $el2 = jQuery( `<button
					class="elementor-add-section-area-button e-block-ai-button"
					title="Generate with AI"
					style="width: 32px; height: 32px; padding: 10px"
				>
					<svg viewBox="0 0 24 24">
						<path fill-rule="evenodd" clip-rule="evenodd"
							d="M18.25 3.25C18.6642 3.25 19 3.58579 19 4C19 4.33152 19.1317 4.64946 19.3661 4.88388C19.6005 5.1183 19.9185 5.25 20.25 5.25C20.6642 5.25 21 5.58579 21 6C21 6.41421 20.6642 6.75 20.25 6.75C19.9185 6.75 19.6005 6.8817 19.3661 7.11612C19.1317 7.35054 19 7.66848 19 8C19 8.41421 18.6642 8.75 18.25 8.75C17.8358 8.75 17.5 8.41421 17.5 8C17.5 7.66848 17.3683 7.35054 17.1339 7.11612C16.8995 6.8817 16.5815 6.75 16.25 6.75C15.8358 6.75 15.5 6.41421 15.5 6C15.5 5.58579 15.8358 5.25 16.25 5.25C16.5815 5.25 16.8995 5.1183 17.1339 4.88388C17.3683 4.64946 17.5 4.33152 17.5 4C17.5 3.58579 17.8358 3.25 18.25 3.25ZM18.25 5.88746C18.2318 5.90673 18.2133 5.92576 18.1945 5.94454C18.1758 5.96333 18.1567 5.98182 18.1375 6C18.1567 6.01819 18.1758 6.03667 18.1945 6.05546C18.2133 6.07424 18.2318 6.09327 18.25 6.11254C18.2682 6.09327 18.2867 6.07424 18.3055 6.05546C18.3242 6.03667 18.3433 6.01819 18.3625 6C18.3433 5.98182 18.3242 5.96333 18.3055 5.94454C18.2867 5.92576 18.2682 5.90673 18.25 5.88746ZM9.25 5.25C9.66421 5.25 10 5.58579 10 6C10 7.39239 10.5531 8.72774 11.5377 9.71231C12.5223 10.6969 13.8576 11.25 15.25 11.25C15.6642 11.25 16 11.5858 16 12C16 12.4142 15.6642 12.75 15.25 12.75C13.8576 12.75 12.5223 13.3031 11.5377 14.2877C10.5531 15.2723 10 16.6076 10 18C10 18.4142 9.66421 18.75 9.25 18.75C8.83579 18.75 8.5 18.4142 8.5 18C8.5 16.6076 7.94688 15.2723 6.96231 14.2877C5.97774 13.3031 4.64239 12.75 3.25 12.75C2.83579 12.75 2.5 12.4142 2.5 12C2.5 11.5858 2.83579 11.25 3.25 11.25C4.64239 11.25 5.97774 10.6969 6.96231 9.71231C7.94688 8.72774 8.5 7.39239 8.5 6C8.5 5.58579 8.83579 5.25 9.25 5.25ZM9.25 9.09234C8.93321 9.70704 8.52103 10.2749 8.02297 10.773C7.52491 11.271 6.95704 11.6832 6.34234 12C6.95704 12.3168 7.52491 12.729 8.02297 13.227C8.52103 13.7251 8.93321 14.293 9.25 14.9077C9.56679 14.293 9.97897 13.7251 10.477 13.227C10.9751 12.729 11.543 12.3168 12.1577 12C11.543 11.6832 10.9751 11.271 10.477 10.773C9.97897 10.2749 9.56679 9.70704 9.25 9.09234ZM18.25 15.25C18.6642 15.25 19 15.5858 19 16C19 16.3315 19.1317 16.6495 19.3661 16.8839C19.6005 17.1183 19.9185 17.25 20.25 17.25C20.6642 17.25 21 17.5858 21 18C21 18.4142 20.6642 18.75 20.25 18.75C19.9185 18.75 19.6005 18.8817 19.3661 19.1161C19.1317 19.3505 19 19.6685 19 20C19 20.4142 18.6642 20.75 18.25 20.75C17.8358 20.75 17.5 20.4142 17.5 20C17.5 19.6685 17.3683 19.3505 17.1339 19.1161C16.8995 18.8817 16.5815 18.75 16.25 18.75C15.8358 18.75 15.5 18.4142 15.5 18C15.5 17.5858 15.8358 17.25 16.25 17.25C16.5815 17.25 16.8995 17.1183 17.1339 16.8839C17.3683 16.6495 17.5 16.3315 17.5 16C17.5 15.5858 17.8358 15.25 18.25 15.25ZM18.25 17.8875C18.2318 17.9067 18.2133 17.9258 18.1945 17.9445C18.1758 17.9633 18.1567 17.9818 18.1375 18C18.1567 18.0182 18.1758 18.0367 18.1945 18.0555C18.2133 18.0742 18.2318 18.0933 18.25 18.1125C18.2682 18.0933 18.2867 18.0742 18.3055 18.0555C18.3242 18.0367 18.3433 18.0182 18.3625 18C18.3433 17.9818 18.3242 17.9633 18.3055 17.9445C18.2867 17.9258 18.2682 17.9067 18.25 17.8875Z" />
					</svg>
				</button>` );

				$el2.on( 'click', () => {
					window.dispatchEvent( new CustomEvent( 'elementor/prompt/open', { detail: {
						id: this.$el[ 0 ].dataset.id,
					} } ) );
				} );

				const $el3 = jQuery( `<div style="position: absolute; top: 10px; left: 10px; z-index: 9999;"
					class="ai-element-button"></div>` ).append( $el2 );

				this.$el.append( $el3 );
			}
		} );
	},

	onRenderEmpty() {
		this.$el.addClass( 'e-empty' );
	},

	onAddChild() {
		this.$el.removeClass( 'e-empty' );

		if ( this.isGridContainer() ) {
			this.handleGridEmptyView();
		}
	},

	renderOnChange( settings ) {
		BaseElementView.prototype.renderOnChange.apply( this, arguments );

		if ( settings.changed.flex_direction || settings.changed.content_width || settings.changed.grid_auto_flow || settings.changed.container_type ) {
			if ( this.isGridContainer() ) {
				this.reInitEmptyView();
			}

			// Make sure the Empty view is removed if we changed from grid to flex and there were widgets.
			if ( this.isFlexContainer() && ! this.isEmpty() ) {
				this.getCorrectContainerElement().find( '> .elementor-empty-view' ).remove();
			}

			this.droppableDestroy();
			this.droppableInitialize( settings );
		}
	},

	onDragStart() {
		this.droppableDestroy();
	},

	onDragEnd() {
		this.droppableInitialize( this.container.settings );
	},

	// TODO: Copied from `views/column.js`.
	attachElContent() {
		BaseElementView.prototype.attachElContent.apply( this, arguments );

		const $tooltip = jQuery( '<div>', {
			class: 'elementor-column-percents-tooltip',
			'data-side': elementorCommon.config.isRTL ? 'right' : 'left',
		} );

		this.$el.children( '.elementor-element-overlay' ).append( $tooltip );
	},

	// TODO: Copied from `views/column.js`.
	getPercentSize( size ) {
		if ( ! size ) {
			size = this.el.getBoundingClientRect().width;
		}

		return +( size / this.$el.parent().width() * 100 ).toFixed( 3 );
	},

	// TODO: Copied from `views/column.js`.
	getPercentsForDisplay() {
		const width = +this.model.getSetting( 'width' ) || this.getPercentSize();

		return width.toFixed( 1 ) + '%';
	},

	onResizeStart() {
		if ( this.ui.percentsTooltip ) {
			this.ui.percentsTooltip.show();
		}
	},

	onResize() {
		// TODO: Copied from `views/column.js`.
		if ( this.ui.percentsTooltip ) {
			this.ui.percentsTooltip.text( this.getPercentsForDisplay() );
		}
	},

	onResizeStop() {
		if ( this.ui.percentsTooltip ) {
			this.ui.percentsTooltip.hide();
		}
	},

	droppableDestroy() {
		this.$el.html5Droppable( 'destroy' );
		this.$el.find( '> .e-con-inner' ).html5Droppable( 'destroy' );
	},

	droppableInitialize( settings ) {
		if ( 'boxed' === settings.get( 'content_width' ) ) {
			this.$el.find( '> .e-con-inner' ).html5Droppable( this.getDroppableOptions() );
		} else {
			this.$el.html5Droppable( this.getDroppableOptions() );
		}
	},

	handleGridEmptyView() {
		const currentContainer = this.getCorrectContainerElement();

		this.moveElementToLastChild(
			currentContainer,
			currentContainer.find( '> .elementor-empty-view' ),
		);
	},

	moveElementToLastChild( parentWrapperElement, childElementToMove ) {
		const parent = parentWrapperElement.get( 0 ),
			child = childElementToMove.get( 0 );

		if ( ! parent || ! child ) {
			return;
		}

		if ( parent.lastChild === child ) {
			return;
		}

		parent.appendChild( child );
	},

	getCorrectContainerElement() {
		return this.isBoxedWidth()
			? this.$el.find( '> .e-con-inner' )
			: this.$el;
	},

	shouldIncrementIndex( side ) {
		if ( ! this.draggingOnBottomOrRightSide( side ) ) {
			return false;
		}

		return ! ( this.isGridContainer() && this.emptyViewIsCurrentlyBeingDraggedOver() );
	},

	draggingOnBottomOrRightSide( side ) {
		return [ 'bottom', 'right' ].includes( side );
	},

	isGridContainer() {
		return 'grid' === this.getContainer().settings.get( 'container_type' );
	},

	isFlexContainer() {
		return 'flex' === this.getContainer().settings.get( 'container_type' );
	},

	isBoxedWidth() {
		return 'boxed' === this.getContainer().settings.get( 'content_width' );
	},

	emptyViewIsCurrentlyBeingDraggedOver() {
		return this.getCorrectContainerElement().find( '> .elementor-empty-view > .elementor-first-add.elementor-html5dnd-current-element' ).length > 0;
	},

	reInitEmptyView() {
		if ( ! this.getCorrectContainerElement().find( '> .elementor-empty-view' ).length ) {
			delete this._showingEmptyView; // Marionette property that needs to be falsy for showEmptyView() to fully execute.
			this.showEmptyView(); // Marionette function.
			this.handleGridEmptyView();
		}
	},
} );

module.exports = ContainerView;
