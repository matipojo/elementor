import { AngieMcpSdk, DEFAULT_CONTAINER_ID } from '@elementor-external/angie-sdk';

const sdk = new AngieMcpSdk();

export const init = (): void => {
	void sdk.loadSidebarV2( {
		host: {Failed to load resource: the server responded with a status of 404 (Not Found)
			appId: 'editor-lite',
		},
	} ).catch( ( error: unknown ) => {
		// eslint-disable-next-line no-console
		console.error( '[Angie Lite] Failed to initialize:', error );
	} );
};
