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

		$this->add_responsive_control(
			'columns',
			[
				'label' => __( 'Columns', 'elementor' ),
				'type' => Controls_Manager::NUMBER,
				'default' => 1,
			]
		);

		$this->add_responsive_control(
			'rows',
			[
				'label' => __( 'Rows', 'elementor' ),
				'type' => Controls_Manager::NUMBER,
				'default' => 2,
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
		<div class="elementor-container elementor-collection">
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
		$cols = max( 1, $settings['columns'] );
		$rows = max( 1, $settings['rows'] );
		$col_class = round(100 / $cols );

		foreach ( range( 1, $rows ) as $row ) {
			echo '<div class="elementor-row">';

			foreach ( range( 1, $cols ) as $col ) {
				echo '<div class="elementor-column elementor-col-' . $col_class . '">';

				foreach ( $this->get_children() as $child ) {
					$child->print_element();
				}

				echo '</div>';
			}

			echo '</div>';
		}
	}

	protected function _content_template() {
		?>
		<div class="elementor-background-overlay"></div>
		<div class="elementor-shape elementor-shape-top"></div>
		<div class="elementor-shape elementor-shape-bottom"></div>
		<div class="elementor-collection elementor-container">
			<#

			var rows = Math.max( 1, settings.rows ),
			cols = Math.max( 1, settings.columns ),
			colClass = Math.round(100 / cols);

			for ( var x in [...Array(rows).keys()] ) {#>
			<div class="elementor-row">
				<# for ( var x in [...Array(cols).keys()] ) {#>
				<div class="elementor-column elementor-col-{{ colClass }}">
					<div class="elementor-collection-item"></div>
				</div>
				<# } #>
			</div>
			<# } #>
		</div>
		<?php
	}
}
