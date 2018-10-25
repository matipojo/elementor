<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor section element.
 *
 * Elementor section handler class is responsible for initializing the section
 * element.
 *
 * @since 1.0.0
 */
class Element_Collection extends Element_Container {

	public function get_icon() {
		return 'eicon-post-list';
	}

	/**
	 * Register section controls.
	 *
	 * Used to add new controls to the section element.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {

		$this->start_controls_section(
			'section_grid',
			[
				'label' => __( 'Grid', 'elementor' ),
				'tab' => Controls_Manager::TAB_LAYOUT,
			]
		);

		$this->add_control(
			'items',
			[
				'label' => __( 'Items', 'elementor' ),
				'type' => Controls_Manager::NUMBER,
				'default' => 3,
			]
		);

		$this->add_responsive_control(
			'columns',
			[
				'label' => __( 'Columns', 'elementor-pro' ),
				'type' => Controls_Manager::SELECT,
				'default' => '3',
				'tablet_default' => '2',
				'mobile_default' => '1',
				'options' => [
					'1' => '1',
					'2' => '2',
					'3' => '3',
					'4' => '4',
					'5' => '5',
					'6' => '6',
				],
				'prefix_class' => 'elementor-grid%s-',
				'frontend_available' => true,
			]
		);

		$this->end_controls_section();

		parent::_register_controls();
	}

	public function before_render() {
		$settings = $this->get_settings_for_display();

		?>
		<<?php echo esc_html( $this->get_html_tag() ); ?> <?php $this->print_render_attribute_string( '_wrapper' ); ?>>
		<?php
		$has_background_overlay = in_array( $settings['background_overlay_background'], [ 'classic', 'gradient' ], true ) ||
			in_array( $settings['background_overlay_hover_background'], [ 'classic', 'gradient' ], true );

		if ( $has_background_overlay ) :
			?>
			<div class="elementor-background-overlay"></div>
		<?php
		endif;

		if ( $settings['shape_divider_top'] ) {
			$this->print_shape_divider( 'top' );
		}

		if ( $settings['shape_divider_bottom'] ) {
			$this->print_shape_divider( 'bottom' );
		}
		?>
		<div class="elementor-container elementor-collection elementor-grid">
		<?php
	}

	public function after_render() {
		?>
		</div>
		</<?php echo esc_html( $this->get_html_tag() ); ?>>
		<?php

		// clear attributes for next loop.
		$this->render_attributes = [];
	}


	protected function _print_content() {
		$settings = $this->get_settings();
		$items = max( 1, $settings['items'] );

		foreach ( range( 1, $items ) as $index ) {
			echo '<div class="elementor-collection-item">';

			foreach ( $this->get_children() as $child ) {
				$child->print_element();
			}

			echo '</div>';
		}
	}

	protected function _content_template() {
		?>
		<div class="elementor-background-overlay"></div>
		<div class="elementor-shape elementor-shape-top"></div>
		<div class="elementor-shape elementor-shape-bottom"></div>
		<div class="elementor-container elementor-collection elementor-grid">
			<#
			var items = Math.max( 1, settings.items );
			for ( var x in [...Array( items ).keys()] ) {#>
			<div class="elementor-collection-item"></div>
			<# } #>
		</div>
		<?php
	}
}
