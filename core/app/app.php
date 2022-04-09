<?php
namespace Elementor\Core\App;

use Elementor\Core\Base\App as BaseApp;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Backward Compatibility.
class App extends BaseApp {

	const PAGE_ID = 'elementor-app';

	public function get_name() {
		return 'app-bc';
	}
}
