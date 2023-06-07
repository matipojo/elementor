<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function echo_select_your_structure_title() {
	echo esc_html__( 'Select your structure', 'elementor' );
}
?>
<script type="text/template" id="tmpl-elementor-empty-preview">
	<div class="elementor-first-add">
		<div class="elementor-icon eicon-plus"></div>
	</div>
</script>

<template id="e-ai-prompt-form">
	<form class="e-ai-prompt-form">
		<input type="text" class="e-ai-prompt-input" placeholder="Enter your prompt" />
		<button class="e-ai-prompt-button">Submit</button>
	</form>
</template>

<script type="text/template" id="tmpl-elementor-add-section">
	<div class="elementor-add-section-inner">
		<div class="elementor-add-section-close elementor-wizard-icon">
			<i class="eicon-close" aria-hidden="true"></i>
			<span class="elementor-screen-only"><?php echo esc_html__( 'Close', 'elementor' ); ?></span>
		</div>
		<?php
		$experiments_manager = Plugin::$instance->experiments;
		if ( $experiments_manager->is_feature_active( 'container_grid' ) ) { ?>
			<div class="elementor-add-section-back elementor-wizard-icon">
				<i class="eicon-chevron-left" aria-hidden="true"></i>
				<span class="elementor-screen-only"><?php echo esc_html__( 'Back', 'elementor' ); ?></span>
			</div>
		<?php } ?>
		<div class="e-view elementor-add-new-section">
			<?php
				$add_container_title = esc_html__( 'Add New Container', 'elementor' );
				$add_section_title = esc_html__( 'Add New Section', 'elementor' );

				$button_title = ( $experiments_manager->is_feature_active( 'container' ) ) ? $add_container_title : $add_section_title;
			?>
			<div class="elementor-add-section-area-button elementor-add-section-button" title="<?php echo esc_attr( $button_title ); ?>">
				<i class="eicon-plus"></i>
			</div>
			<div class="elementor-add-section-area-button e-block-ai-button" title="Generate with AI">
				<svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M9.125 1.625C9.33211 1.625 9.5 1.79289 9.5 2C9.5 2.16576 9.56585 2.32473 9.68306 2.44194C9.80027 2.55915 9.95924 2.625 10.125 2.625C10.3321 2.625 10.5 2.79289 10.5 3C10.5 3.20711 10.3321 3.375 10.125 3.375C9.95924 3.375 9.80027 3.44085 9.68306 3.55806C9.56585 3.67527 9.5 3.83424 9.5 4C9.5 4.20711 9.33211 4.375 9.125 4.375C8.91789 4.375 8.75 4.20711 8.75 4C8.75 3.83424 8.68415 3.67527 8.56694 3.55806C8.44973 3.44085 8.29076 3.375 8.125 3.375C7.91789 3.375 7.75 3.20711 7.75 3C7.75 2.79289 7.91789 2.625 8.125 2.625C8.29076 2.625 8.44973 2.55915 8.56694 2.44194C8.68415 2.32473 8.75 2.16576 8.75 2C8.75 1.79289 8.91789 1.625 9.125 1.625ZM9.125 2.94373C9.11591 2.95336 9.10667 2.96288 9.09727 2.97227C9.08788 2.98167 9.07836 2.99091 9.06873 3C9.07836 3.00909 9.08788 3.01833 9.09727 3.02773C9.10667 3.03712 9.11591 3.04664 9.125 3.05627C9.13409 3.04664 9.14333 3.03712 9.15273 3.02773C9.16212 3.01833 9.17164 3.00909 9.18127 3C9.17164 2.99091 9.16212 2.98167 9.15273 2.97227C9.14333 2.96288 9.13409 2.95336 9.125 2.94373ZM4.625 2.625C4.83211 2.625 5 2.79289 5 3C5 3.69619 5.27656 4.36387 5.76884 4.85616C6.26113 5.34844 6.92881 5.625 7.625 5.625C7.83211 5.625 8 5.79289 8 6C8 6.20711 7.83211 6.375 7.625 6.375C6.92881 6.375 6.26113 6.65156 5.76884 7.14384C5.27656 7.63613 5 8.30381 5 9C5 9.20711 4.83211 9.375 4.625 9.375C4.41789 9.375 4.25 9.20711 4.25 9C4.25 8.30381 3.97344 7.63613 3.48116 7.14384C2.98887 6.65156 2.32119 6.375 1.625 6.375C1.41789 6.375 1.25 6.20711 1.25 6C1.25 5.79289 1.41789 5.625 1.625 5.625C2.32119 5.625 2.98887 5.34844 3.48116 4.85616C3.97344 4.36387 4.25 3.69619 4.25 3C4.25 2.79289 4.41789 2.625 4.625 2.625ZM4.625 4.54617C4.46661 4.85352 4.26051 5.13746 4.01149 5.38649C3.76246 5.63551 3.47852 5.84161 3.17117 6C3.47852 6.15839 3.76246 6.36449 4.01149 6.61351C4.26051 6.86254 4.46661 7.14648 4.625 7.45383C4.78339 7.14648 4.98949 6.86254 5.23851 6.61351C5.48754 6.36449 5.77148 6.15839 6.07883 6C5.77148 5.84161 5.48754 5.63551 5.23851 5.38649C4.98949 5.13746 4.78339 4.85352 4.625 4.54617ZM9.125 7.625C9.33211 7.625 9.5 7.79289 9.5 8C9.5 8.16576 9.56585 8.32473 9.68306 8.44194C9.80027 8.55915 9.95924 8.625 10.125 8.625C10.3321 8.625 10.5 8.79289 10.5 9C10.5 9.20711 10.3321 9.375 10.125 9.375C9.95924 9.375 9.80027 9.44085 9.68306 9.55806C9.56585 9.67527 9.5 9.83424 9.5 10C9.5 10.2071 9.33211 10.375 9.125 10.375C8.91789 10.375 8.75 10.2071 8.75 10C8.75 9.83424 8.68415 9.67527 8.56694 9.55806C8.44973 9.44085 8.29076 9.375 8.125 9.375C7.91789 9.375 7.75 9.20711 7.75 9C7.75 8.79289 7.91789 8.625 8.125 8.625C8.29076 8.625 8.44973 8.55915 8.56694 8.44194C8.68415 8.32473 8.75 8.16576 8.75 8C8.75 7.79289 8.91789 7.625 9.125 7.625ZM9.125 8.94373C9.11591 8.95336 9.10667 8.96288 9.09727 8.97227C9.08788 8.98167 9.07836 8.99091 9.06873 9C9.07836 9.00909 9.08788 9.01833 9.09727 9.02773C9.10667 9.03712 9.11591 9.04664 9.125 9.05627C9.13409 9.04664 9.14333 9.03712 9.15273 9.02773C9.16212 9.01833 9.17164 9.00909 9.18127 9C9.17164 8.99091 9.16212 8.98167 9.15273 8.97227C9.14333 8.96288 9.13409 8.95336 9.125 8.94373Z" />
				</svg>
			</div>
<!--			<# if ( 'loop-item' !== elementor.documents.getCurrent()?.config?.type || elementorCommon.config.experimentalFeatures[ 'container' ] ) { #>-->
<!--			<div class="elementor-add-section-area-button elementor-add-template-button" title="--><?php //echo esc_attr__( 'Add Template', 'elementor' ); ?><!--">-->
<!--				<i class="eicon-folder"></i>-->
<!--			</div>-->
<!--			<# } #>-->
<!--			<div class="elementor-add-section-drag-title">--><?php //echo esc_html__( 'Drag widget here', 'elementor' ); ?><!--</div>-->
		</div>
		<div class="e-view e-con-shared-styles e-con-select-type">
			<div class="e-con-select-type__title"><?php echo esc_html__( 'Which layout would you like to use?', 'elementor' ); ?></div>
			<div class="e-con-select-type__icons">
				<div class="e-con-select-type__icons__icon flex-preset-button">
					<svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect width="41.698" height="84.9997" fill="#D5DADE"/>
						<rect x="43.3018" width="41.698" height="41.6498" fill="#D5DADE"/>
						<rect x="43.3018" y="43.3506" width="41.698" height="41.6498" fill="#D5DADE"/>
					</svg>
					<div class="e-con-select-type__icons__icon__subtitle"><?php echo esc_html__( 'Flexbox', 'elementor' ); ?></div>
				</div>
				<div class="e-con-select-type__icons__icon grid-preset-button">
					<svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect x="0.5" y="0.5" width="83.9997" height="84" stroke="#9DA5AE" stroke-dasharray="2 2"/>
						<path d="M42.501 0.484375V84.6259" stroke="#9DA5AE" stroke-dasharray="1 1"/>
						<path d="M84.623 42.501L-0.00038953 42.501" stroke="#9DA5AE" stroke-dasharray="1 1"/>
					</svg>
					<div class="e-con-select-type__icons__icon__subtitle"><?php echo esc_html__( 'Grid', 'elementor' ); ?></div>
				</div>
			</div>
		</div>
		<div class="e-view elementor-select-preset">
			<div class="elementor-select-preset-title"><?php echo_select_your_structure_title(); ?></div>
			<ul class="elementor-select-preset-list">
				<#
					const structures = [ 10, 20, 30, 40, 21, 22, 31, 32, 33, 50, 34, 60 ];

					structures.forEach( ( structure ) => {
						const preset = elementor.presetsFactory.getPresetByStructure( structure ); #>

						<li class="elementor-preset elementor-column elementor-col-16" data-structure="{{ structure }}">
							{{{ elementor.presetsFactory.getPresetSVG( preset.preset ).outerHTML }}}
						</li>
					<# } ); #>
			</ul>
		</div>
		<div class="e-view e-con-select-preset">
			<div class="e-con-select-preset__title"><?php echo_select_your_structure_title(); ?></div>
			<div class="e-con-select-preset__list">
				<#
					elementor.presetsFactory.getContainerPresets().forEach( ( preset ) => {
					#>
					<div class="e-con-preset" data-preset="{{ preset }}">
						{{{ elementor.presetsFactory.generateContainerPreset( preset ) }}}
					</div>
					<#
				} );
				#>
			</div>
		</div>
		<div class="e-view e-con-shared-styles e-con-select-preset-grid">
			<div class="e-con-select-preset-grid__title"><?php echo_select_your_structure_title(); ?></div>
			<div class="e-con-select-preset-grid__list">
				<#
					elementor.presetsFactory.getContainerGridPresets().forEach( ( preset ) => {
				#>
					<div class="e-con-choose-grid-preset" data-structure="{{ preset }}">
						{{{ elementor.presetsFactory.generateContainerGridPreset( preset ) }}}
					</div>
				<#
					} );
				#>
			</div>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-elementor-tag-controls-stack-empty">
	<?php echo esc_html__( 'This tag has no settings.', 'elementor' ); ?>
</script>
