<?php
namespace Elementor\Core\App\Modules\Onboarding;

use Elementor\Core\Base\Module as BaseModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

// Backward Compatibility.
class Module extends BaseModule {

	const VERSION = '1.0.0';

	public function get_name() {
		return 'onboarding-bc';
	}
}
