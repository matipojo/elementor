const request = ( endpoint, data = {} ) => {
	return new Promise( ( resolve, reject ) => elementorCommon.ajax.addRequest(
		endpoint, {
			success: resolve,
			error: reject,
			data,
		},
	) );
};

export const updateGlobals = ( data ) => request( 'onboarding_update_globals', { ...data } );
export const updateData = ( data ) => request( 'onboarding_update_data', { ...data } );
