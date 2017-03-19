<?php
use Elementor\Global_CSS_File;use Elementor\Modules\AMP\AMP;use Elementor\Post_CSS_File;use Elementor\Utils;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

// TODO: implement 404 page
the_post();

/** @var StdClass $logo */
$logo = AMP::instance()->get( 'logo' , (object) [
	'url' => '',
	'width' => '',
	'height' => '',
] );

$thumbnail = wp_get_attachment_image_src( get_post_thumbnail_id() );

// get content and register amp components;
ob_start();
the_content();
$content = ob_get_clean();

?><!doctype html>
<html amp>
<head>
	<meta charset="utf-8">
	<script async src="https://cdn.ampproject.org/v0.js"></script>
	<!-- ## Setup -->

	<?php AMP::instance()->render_amp_components() ?>

	<link rel="canonical" href="<?php echo esc_attr( get_the_permalink() ) ?>">

	<!-- ## Metadata -->
	<!-- The Top Stories carousel requires schema.org markup for one of the following types: Article, NewsArticle, BlogPosting, or VideoObject. [Learn more](https://developers.google.com/structured-data/carousels/top-stories#markup_specification).  -->
	<script type="application/ld+json">
	{
		"@context": "http://schema.org",
		"@type": "NewsArticle",
		"mainEntityOfPage": "<?php echo esc_attr( get_the_permalink() ) ?>",
		"headline": "<?php echo esc_attr( get_the_title() ) ?>",
		"datePublished": "<?php echo esc_attr( get_the_date() ) ?>",
		"dateModified": "<?php echo esc_attr( get_the_modified_date() ) ?>",
		"description": "<?php echo esc_attr( get_the_excerpt() ) ?>",
		"author": {
			"@type": "Person",
			"name": "<?php echo esc_attr( get_the_author() ) ?>"
		},
		"publisher": {
			"@type": "Organization",
			"name": "<?php echo esc_attr( get_bloginfo() ) ?>",
			"logo": {
				"@type": "ImageObject",
				"url": "<?php echo esc_attr( $logo->url ) ?>",
				"width": <?php echo esc_attr( $logo->width ) ?>,
				"height": <?php echo esc_attr( $logo->height ) ?>
			}
		},
		<?php if ( $thumbnail ) : ?>
		"image": {
			"@type": "ImageObject",
			"url": "<?php echo esc_attr( $thumbnail[0] ) ?>",
			"height": "<?php echo esc_attr( $thumbnail[1] ) ?>",
			"width": "<?php echo esc_attr( $thumbnail[2] ) ?>"
		}
		<?php endif; ?>
	}
	</script>
	<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
	<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>

	<?php \Elementor\Plugin::$instance->frontend->print_google_fonts(); ?>

	<style amp-custom>
		<?php
			$suffix = Utils::is_script_debug() ? '' : '.min';
			require	ELEMENTOR_PATH . 'assets/css/amp' . $suffix . '.css';
			$css_file = new Global_CSS_File();
			echo $css_file->get_css();
			$css_file = new Post_CSS_File( get_the_ID() );
			echo $css_file->get_css();
		?>

		main > p, main > div, main > h2, main > figure > figcaption {
			padding: 1rem;
		}

		figure {
			margin: 1rem 0;
			padding: 0;
		}

		figure > figcaption {
			padding: .5rem 1rem;
		}

		.amp-ad-container {
			display: flex;
		}

		amp-ad {
			margin: 0 auto;
		}

		.carousel .slide > amp-img > img {
			object-fit: contain;
		}

		.heading {
			padding-bottom: 8px;
		}

		.heading h1 {
			font-size: 3rem;
			line-height: 3.5rem;
			margin-bottom: 1rem;
		}

		.heading > #summary {
			font-weight: 500;
		}

		.heading > small {
			color: #656565;
		}
		</style>
</head>
<body>

<!-- -->
<main>
	<div class="heading">
		<h1><?php the_title(); ?></h1>
	</div>

	<!-- ## Social Sharing  -->

	<!-- The Social Share extension provides a common interface for share buttons.  Learn more about `amp-social-share` [here](/components/amp-social-share/).  -->
	<p class="heading">
		<amp-social-share type="twitter" width="45" height="33"></amp-social-share>
		<amp-social-share type="facebook" width="45" height="33" data-attribution="<?php echo AMP::instance()->get( 'facebook_id' ); ?>"></amp-social-share>
		<amp-social-share type="gplus" width="45" height="33"></amp-social-share>
		<amp-social-share type="email" width="45" height="33"></amp-social-share>
		<amp-social-share type="pinterest" width="45" height="33"></amp-social-share>
	</p>

	<?php echo $content; ?>
</main>

<!-- ## User Analytics -->
<!-- Analytics must be configured in the body. Here we use Google Analytics to track pageviews.  -->
<amp-analytics type="googleanalytics">
	<script type="application/json">
		{
			"vars": {
				"account": "<?php echo AMP::instance()->get( 'google_analytics_id' ); ?>"
			},
			"triggers": {
				"default pageview": {
					"on": "visible",
					"request": "pageview",
					"vars": {
						"title": "{{title}}"
					}
				}
			}
		}
	</script>
</amp-analytics>
</body>
</html>
