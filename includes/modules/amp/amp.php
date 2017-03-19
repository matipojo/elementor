<?php

namespace Elementor\Modules\AMP;

use Elementor\Group_Control_Image_Size;
use Elementor\Plugin;
use Elementor\Tools;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class AMP {

	const OPTION_NAME_PREFIX = 'elementor_amp_';

	/**
	 * @var self
	 */
	public static $instance = null;

	private $amp_components = [];

	public static function start_render_images() {
		ob_start();
	}

	public static function end_render_images( $settings, $key_name ) {
		$html = ob_get_clean();

		$html = preg_replace_callback( '/(<img([^>]+)>)/i', function() use ( $settings, $key_name ) {
			$attributes = Group_Control_Image_Size::get_attachment_image_attributes( $settings, $key_name );

			if ( isset( $settings['layout'] ) ) {
				$attributes['layout'] = $settings['layout'];
			} else {
				$attributes['layout'] = '';
			}

			if ( ( empty( $attributes['width'] ) || empty( $attributes['height'] ) ) && ! empty( $settings[ $key_name ]['id'] ) ) {
				$image = wp_get_attachment_image_src( $settings[ $key_name ]['id'] );
			}

			if ( ! empty( $image ) ) {
				$attributes['width'] = $image[1];
				$attributes['height'] = $image[2];
			} elseif ( defined( 'AMP__DIR__' ) ) {
				require_once( AMP__DIR__ . '/includes/utils/class-amp-image-dimension-extractor.php' );
				$images = \AMP_Image_Dimension_Extractor::extract( [ $attributes['src'] ] );
				$values = current( $images );
				$attributes['width'] = $values['width'];
				$attributes['height'] = $values['height'];
			} else {
				$attributes['height'] = 300;
				$attributes['height'] = 300;
			}

			unset( $attributes['sizes'], $attributes['srcset'] );

			$html = '<amp-img ';
			foreach ( $attributes as $name => $value ) {
				$html .= sprintf( '%s="%s"', $name, $value );
			}

			$html .= '></amp-img>';

			return $html;
		}, $html );

		return $html;
	}

	/**
	 * Throw error on object clone
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object therefore, we don't want the object to be cloned.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'elementor' ), '1.0.0' );
	}

	/**
	 * Disable unserializing of the class
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'elementor' ), '1.0.0' );
	}

	/**
	 * @return self
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function get( $option, $default = false ) {
		return get_option( self::OPTION_NAME_PREFIX . $option, $default );
	}

	public function register_settings_fields() {
		$controls_class_name = '\Elementor\Settings_Controls';
		$validations_class_name = '\Elementor\Settings_Validations';

		$amp_section = 'elementor_amp_section';

		add_settings_section(
			$amp_section,
			__( 'AMP', 'elementor' ),
			'__return_empty_string', // No need intro text for this section right now
			Tools::PAGE_ID
		);

		$field_id = 'elementor_amp_enabled';

		add_settings_field(
			$field_id,
			__( 'Status', 'elementor' ),
			[ $controls_class_name, 'render' ],
			Tools::PAGE_ID,
			$amp_section,
			[
				'id' => $field_id,
				'class' => $field_id,
				'type' => 'select',
				'options' => [
					'' => __( 'Disabled', 'elementor' ),
					'1' => __( 'Enabled', 'elementor' ),
				],
				'desc' => __( 'AMP improves your Speed and SEO for mobile devices', 'elementor' ),
			]
		);

		register_setting( Tools::PAGE_ID, $field_id );

		$field_id = 'elementor_amp_facebook_id';

		add_settings_field(
			$field_id,
			__( 'Facebook page ID', 'elementor' ),
			[ $controls_class_name, 'render' ],
			Tools::PAGE_ID,
			$amp_section,
			[
				'id' => $field_id,
				'class' => $field_id . ' elementor-default-hide',
				'type' => 'text',
			]
		);

		register_setting( Tools::PAGE_ID, $field_id );

		$field_id = 'elementor_amp_analytics_id';

		add_settings_field(
			$field_id,
			__( 'Analytics ID', 'elementor' ),
			[ $controls_class_name, 'render' ],
			Tools::PAGE_ID,
			$amp_section,
			[
				'id' => $field_id,
				'class' => $field_id . ' elementor-default-hide',
				'type' => 'text',
			]
		);

		register_setting( Tools::PAGE_ID, $field_id );
	}

	public function template_redirect() {
		if ( Plugin::$instance->preview->is_preview_mode() ) {
			return;
		}

		add_filter( 'template_include', [ $this, 'template_include' ], 1 );
	}
	public function template_include( $template ) {
		return __DIR__ . '/templates/amp.php';
	}

	/**
	 * @param $component
	 *
	 * @return array
	 */
	public function add_component( $component ) {
		return $this->amp_components[ $component ] = $component;
	}

	public function render_amp_components() {
		$scripts = '';
		foreach ( $this->amp_components as $amp_component ) {
			$scripts .= '<script async custom-element="amp-' . $amp_component . '" src="https://cdn.ampproject.org/v0/amp-' . $amp_component . '-0.1.js"></script>';
		}
		echo $scripts;
	}

	public function wp_amp_init() {
		$cpt_support = get_option( 'elementor_cpt_support', [ 'page', 'post' ] );

		foreach ( $cpt_support as $cpt_slug ) {
			add_post_type_support( $cpt_slug, AMP_QUERY_VAR );
		}
	}

	public function pre_amp_render_post() {
		$this->is_amp( true );
	}

	public function __construct() {
		if ( is_admin() ) {
			add_action( 'admin_init', [ $this, 'register_settings_fields' ], 30 ); /* 30 = after other tools */
		}

		if ( ! self::get( 'enabled' ) ) {
			return;
		}

		//WP AMP
		add_action( 'amp_init', [ $this, 'wp_amp_init' ] );
		add_action( 'pre_amp_render_post', [ $this, 'pre_amp_render_post' ] );

		if ( $this->is_amp() ) {
			add_action( 'template_redirect', [ $this, 'template_redirect' ] );
		}
	}

	public function is_amp( $value = null ) {
		static $is_amp = null;

		if ( ! is_null( $value ) ) {
			$is_amp = $value;
		} elseif ( is_null( $is_amp ) ) {
			$is_amp = ! Plugin::$instance->editor->is_edit_mode() && ! Plugin::$instance->preview->is_preview_mode() && isset( $_GET['elementor-amp'] );
		}

		return $is_amp;
	}
}
