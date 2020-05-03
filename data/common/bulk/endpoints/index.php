<?php

namespace Elementor\Data\Common\Bulk\Endpoints;

use Elementor\Data\Base\Endpoint;
use Elementor\Data\Manager;
use WP_Error;

class Index extends Endpoint {

	public function get_name() {
		return 'index';
	}

	protected function get_items( $request ) {
		$result = [];
		$requested_routes = $request->get_param( 'routes' );

		if ( ! $requested_routes || ! is_array( $requested_routes ) ) {
			return new WP_Error( 'invalid_param', __( 'Invalid routes parameter.' ), [ 'status' => 400 ] );
		}

		foreach ( $requested_routes as $requested_route ) {
			$route = explode( ':', $requested_route );
			$query = wp_parse_url( $route[1], PHP_URL_QUERY );

			if ( $query ) {
				$command = str_replace( $query, '', $route[1] );
			} else {
				$command = $route[1];
			}

			$command = str_replace( '?', '', $command );
			$command = str_replace( '/index', '', $command );

			$args = [];

			parse_str( $query, $args );

			$result[ $route[0] ] = Manager::run( $command, $args );
		}

		return $result;
	}

	public function permission_callback( $request ) {
		// Since handled by routes.
		return true;
	}
}
