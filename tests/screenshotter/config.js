const config = {
	/**
	 * Declare an array of templates to import for testing
	 * The name of template must be same as the post_name
	 */
	templates: [
		'buttons',
		'dividers',
		'global-settings',
		'headings',
		'icons',
		'icons-box',
		'icons-list',
		'image',
		'image-box',
		'social-icons',
		'testimonials',
		'text-editor',
	],
	/**
	 * Declare the url origin of local server for testing
	 */
	url_origin: 'http://localhost:3333/?pagename=',
	/**
	 * An array of screen size objects your DOM will be tested against. Add as many as you like -- but add at least one.
	 */
	tests_viewports: [
		{
			label: 'phone',
			width: 767,
			height: 575,
		},
		{
			label: 'tablet',
			width: 1024,
			height: 768,
		},
		{
			label: 'desktop',
			width: 1366,
			height: 768,
		},
	],
};
module.exports = config;
