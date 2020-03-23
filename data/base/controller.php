<?php

namespace Elementor\Data\Base;

use WP_REST_Controller;
use WP_REST_Server;

abstract class Controller extends WP_REST_Controller {
	const DEFAULT_ROOT_NAMESPACE = 'elementor';

	private $manager;

	public $endpoints;

	public function __construct( $manager, $version = '1' ) {
		$this->manager = $manager;

		$this->namespace = self::DEFAULT_ROOT_NAMESPACE . '/v' . $version;
		$this->rest_base = $this->get_name();

		add_action( 'rest_api_init', function() {
			$this->register_internal_endpoints();
			$this->register_endpoints();
		} );
	}

	abstract protected function get_name();

	public function get_namespace() {
		return $this->namespace;
	}

	public function get_reset_base() {
		return $this->rest_base;
	}

	abstract public function register_endpoints();

	protected function register_internal_endpoints() {
		register_rest_route( $this->get_namespace(), '/' . $this->get_reset_base(), [
			[
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_items' ),
				'args' => [],
			],
		] );
	}

	protected function register_endpoint( $class ) {
		$endpoint_instance = new $class( $this );
		$endpoint_route = $this->get_name() . '/' . $endpoint_instance->get_name();

		$this->endpoints[ $endpoint_route ] = $endpoint_instance;
	}

	public function get_items( $request ) {
		// Default get_items return index of the controller with it endpoints.
		$server = rest_get_server();

		$request['namespace'] = $this->get_namespace();

		return $server->get_namespace_index( $request );
	}
}