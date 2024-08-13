
/**
 * Create a URL with parameters
 * @param  baseUrl
 * @param  params  {Object.<string, string>}
 * @return {string}
 */
const createUrlWithParams = ( baseUrl, params ) => {
	const url = new URL( baseUrl );

	Object.entries( params ).forEach( ( [ key, value ] ) => {
		url.searchParams.append( key, value );
	} );

	return url.toString();
};

/**
 * Create a URL with UTM parameters for AI pricing page
 * @param  utm {{utm_term: string, utm_content: string}}
 * @return {string}
 */
export const createPricingUrl = ( utm ) => createUrlWithParams( 'https://elementor.com/pricing-ai/', {
	utm_campaign: 'purchase-ai',
	utm_source: 'ai-popup',
	utm_medium: 'wp-dash',
	...utm,
} );

/**
 * Create a URL with UTM parameters for AI upgrade page
 * @param  utm {{utm_term: string, utm_content: string}}
 * @return {string}
 */
export const createUpgradeUrl = ( utm ) => createUrlWithParams( 'https://my.elementor.com/upgrade-subscription/', {
	utm_campaign: 'upgrade-ai',
	utm_source: 'ai-popup',
	utm_medium: 'wp-dash',
	...utm,
} );
