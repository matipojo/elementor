<?php

namespace Elementor\Modules\AngieLite;

use Elementor\Api;
use Elementor\Core\Base\Module as BaseModule;
use Elementor\Core\Utils\Hints;
use Elementor\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Module extends BaseModule {

	private const PACKAGE_NAME = 'angie-lite';

	public function get_name(): string {
		return self::PACKAGE_NAME;
	}

	public static function is_active(): bool {
		return ! Hints::is_plugin_active( 'angie' );
	}

	public function __construct() {
		parent::__construct();

		if ( ! self::is_active() ) {
			return;
		}

		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 20 );
	}

	public function enqueue_scripts(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$package = self::PACKAGE_NAME;
		$asset_file = ELEMENTOR_ASSETS_PATH . "js/packages/{$package}/{$package}.asset.php";

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;
		$handle = $asset['handle'] ?? 'elementor-v2-' . $package;

		if ( ! wp_script_is( $handle, 'registered' ) ) {
			wp_register_script(
				$handle,
				$this->get_package_script_url( $package ),
				$asset['deps'] ?? [],
				ELEMENTOR_VERSION,
				true
			);
		}

		wp_localize_script( $handle, 'angieConfig', $this->get_angie_config() );
		wp_enqueue_script( $handle );
	}

	private function get_package_script_url( string $package ): string {
		$relative_path = "js/packages/{$package}/{$package}";
		$assets_path = ELEMENTOR_ASSETS_PATH . $relative_path;
		$assets_url = ELEMENTOR_ASSETS_URL . $relative_path;

		if ( Utils::is_script_debug() && file_exists( "{$assets_path}.js" ) ) {
			return "{$assets_url}.js";
		}

		return "{$assets_url}.min.js";
	}

	private function get_angie_config(): array {
		return [
			'version' => ELEMENTOR_VERSION,
			'wpVersion' => get_bloginfo( 'version' ),
			'siteKey' => Api::get_site_key(),
			'iframeOrigin' => 'https://angie.elementor.com',
			'sidebarPath' => 'angie/embedded',
			'plugins' => [
				'elementor' => true,
				'elementorPro' => Utils::has_pro(),
				'woocommerce' => class_exists( 'WooCommerce' ),
				'acf' => class_exists( 'ACF' ),
				'classicEditor' => ! use_block_editor_for_post_type( 'page' ),
			],
		];
	}
}
