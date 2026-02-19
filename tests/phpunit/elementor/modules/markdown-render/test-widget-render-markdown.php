<?php
namespace Elementor\Testing\Modules\MarkdownRender;

use Elementor\Plugin;
use ElementorEditorTesting\Elementor_Test_Base;

class Test_Widget_Render_Markdown extends Elementor_Test_Base {

	private function create_widget( string $widget_type, array $settings ): ?\Elementor\Widget_Base {
		$data = [
			'id' => 'test-' . $widget_type,
			'elType' => 'widget',
			'widgetType' => $widget_type,
			'settings' => $settings,
		];

		$element = Plugin::$instance->elements_manager->create_element_instance( $data );

		return $element instanceof \Elementor\Widget_Base ? $element : null;
	}

	public function test_heading_renders_h1_markdown() {
		// Arrange
		$widget = $this->create_widget( 'heading', [
			'title' => 'Hello World',
			'header_size' => 'h1',
		] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Heading widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertEquals( '# Hello World', $md );
	}

	public function test_heading_renders_h3_with_link() {
		// Arrange
		$widget = $this->create_widget( 'heading', [
			'title' => 'Linked Title',
			'header_size' => 'h3',
			'link' => [ 'url' => 'https://example.com' ],
		] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Heading widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertStringContainsString( '### [Linked Title](https://example.com)', $md );
	}

	public function test_heading_empty_title_returns_empty() {
		// Arrange
		$widget = $this->create_widget( 'heading', [
			'title' => '',
			'header_size' => 'h2',
		] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Heading widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertEmpty( $md );
	}

	public function test_button_renders_link() {
		// Arrange
		$widget = $this->create_widget( 'button', [
			'text' => 'Click Me',
			'link' => [ 'url' => 'https://example.com/action' ],
		] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Button widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertStringContainsString( '[Click Me](https://example.com/action)', $md );
	}

	public function test_button_without_link_renders_bold() {
		// Arrange
		$widget = $this->create_widget( 'button', [
			'text' => 'Submit',
			'link' => [ 'url' => '' ],
		] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Button widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertEquals( '**Submit**', $md );
	}

	public function test_divider_renders_horizontal_rule() {
		// Arrange
		$widget = $this->create_widget( 'divider', [] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Divider widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertEquals( '---', $md );
	}

	public function test_alert_renders_blockquote() {
		// Arrange
		$widget = $this->create_widget( 'alert', [
			'alert_title' => 'Warning',
			'alert_description' => 'Something happened',
		] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Alert widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertEquals( '> **Warning:** Something happened', $md );
	}

	public function test_testimonial_renders_quote() {
		// Arrange
		$widget = $this->create_widget( 'testimonial', [
			'testimonial_content' => 'Great product!',
			'testimonial_name' => 'John Doe',
			'testimonial_job' => 'CEO',
		] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Testimonial widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertStringContainsString( '> "Great product!"', $md );
		$this->assertStringContainsString( '-- John Doe, CEO', $md );
	}

	public function test_spacer_returns_empty() {
		// Arrange
		$widget = $this->create_widget( 'spacer', [] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Spacer widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertEmpty( $md );
	}

	public function test_icon_returns_empty() {
		// Arrange
		$widget = $this->create_widget( 'icon', [] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Icon widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertEmpty( $md );
	}

	public function test_icon_list_renders_list() {
		// Arrange
		$widget = $this->create_widget( 'icon-list', [
			'icon_list' => [
				[ 'text' => 'Item One', 'link' => [ 'url' => '' ] ],
				[ 'text' => 'Item Two', 'link' => [ 'url' => 'https://example.com' ] ],
			],
		] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Icon List widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertStringContainsString( '- Item One', $md );
		$this->assertStringContainsString( '- [Item Two](https://example.com)', $md );
	}

	public function test_accordion_renders_sections() {
		// Arrange
		$widget = $this->create_widget( 'accordion', [
			'tabs' => [
				[ 'tab_title' => 'Section 1', 'tab_content' => 'Content 1' ],
				[ 'tab_title' => 'Section 2', 'tab_content' => 'Content 2' ],
			],
		] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'Accordion widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertStringContainsString( '### Section 1', $md );
		$this->assertStringContainsString( 'Content 1', $md );
		$this->assertStringContainsString( '### Section 2', $md );
		$this->assertStringContainsString( 'Content 2', $md );
	}

	public function test_fallback_strips_tags() {
		// Arrange
		$widget = $this->create_widget( 'wordpress', [
			'widget' => 'WP_Widget_Text',
		] );

		if ( ! $widget ) {
			$this->markTestSkipped( 'WordPress widget not available' );
		}

		// Act
		$md = $widget->render_markdown();

		// Assert
		$this->assertIsString( $md );
		$this->assertStringNotContainsString( '<div', $md );
		$this->assertStringNotContainsString( '<span', $md );
	}
}
