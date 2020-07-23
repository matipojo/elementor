<?php
namespace Elementor\Core\Kits;

use Elementor\Core\Files\CSS\Post;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor kit design system CSS file.
 *
 * Elementor design system class is responsible for kit global css variables.
 * file.
 *
 * @since 3.0.0
 */
class Design_System_CSS extends Post {
	const FILE_HANDLER_ID = 'elementor-kit-design-system';

	const FILE_PREFIX = 'design-system-';

	const META_KEY = '_elementor_design_system_css';

	/**
	 * Get CSS file name.
	 *
	 * Retrieve the CSS file name.
	 *
	 * @since 3.0.0
	 * @access public
	 *
	 * @return string CSS file name.
	 */
	public function get_name() {
		return 'kit-design-system';
	}

	/**
	 * Get file handle ID.
	 *
	 * Retrieve the handle ID for the global post CSS file.
	 *
	 * @since 3.0.0
	 * @access protected
	 *
	 * @return string CSS file handle ID.
	 */
	protected function get_file_handle_id() {
		return self::FILE_HANDLER_ID . '-' . $this->get_post_id();
	}

	protected function has_style_settings( $control ) {
		return ! empty( $control['css_file'] ) && self::FILE_HANDLER_ID === $control['css_file'];
	}

	protected function is_global_parsing_supported() {
		return false;
	}

	protected function render_css() {
		$kit = Plugin::$instance->documents->get( $this->get_post_id() );

		$this->add_controls_stack_style_rules(
			$kit,
			$this->get_style_controls( $kit ),
			$kit->get_settings(),
			[ '{{WRAPPER}}' ],
			[ $kit->get_css_wrapper_selector() ]
		);
	}
}
