<?php

namespace Elementor\Core\Settings\EditorPreferences;

use Elementor\Controls_Manager;
use Elementor\Core\Settings\Base\Model as BaseModel;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Model extends BaseModel {

	/**
	 * Get element name.
	 *
	 * Retrieve the element name.
	 *
	 * @return string The name.
	 * @since 2.8.0
	 * @access public
	 *
	 */
	public function get_name() {
		return 'editor-preferences';
	}

	/**
	 * Get panel page settings.
	 *
	 * Retrieve the page setting for the current panel.
	 *
	 * @since 2.8.0
	 * @access public
	 */
	public function get_panel_page_settings() {
		return [
			'title' => esc_html__( 'User Preferences', 'elementor' ),
		];
	}

	/**
	 * @since 3.1.0
	 * @access protected
	 */
	protected function register_controls() {
		$this->start_controls_section( 'preferences', [
			'tab' => Controls_Manager::TAB_SETTINGS,
			'label' => esc_html__( 'Preferences', 'elementor' ),
		] );

		$this->add_control(
			'ui_theme',
			[
				'label' => esc_html__( 'UI Theme', 'elementor' ),
				'type' => Controls_Manager::SELECT,
				'description' => esc_html__( 'Set light or dark mode, or use Auto Detect to sync it with your OS setting.', 'elementor' ),
				'default' => 'auto',
				'options' => [
					'auto' => esc_html__( 'Auto Detect', 'elementor' ),
					'light' => esc_html__( 'Light', 'elementor' ),
					'dark' => esc_html__( 'Dark', 'elementor' ),
				],
			]
		);

		$this->add_control(
			'panel_width',
			[
				'label' => esc_html__( 'Panel Width', 'elementor' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 200,
						'max' => 680,
					],
				],
				'default' => [
					'size' => 300,
				],
			]
		);

		$this->add_control(
			'edit_buttons',
			[
				'label' => esc_html__( 'Editing Handles', 'elementor' ),
				'type' => Controls_Manager::SWITCHER,
				'description' => esc_html__( 'Show editing handles when hovering over the element edit button.', 'elementor' ),
			]
		);

		$this->add_control(
			'lightbox_in_editor',
			[
				'label' => esc_html__( 'Enable Lightbox In Editor', 'elementor' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => 'yes',
			]
		);

		$this->end_controls_section();
	}
}
