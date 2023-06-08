import { createSlice } from '@elementor/store';

export default createSlice( {
	name: 'a-what',
	initialState: {
		results: {},
	},
	reducers: {
		addResult( state, { payload: { id, prompt, result } } ) {
			state.results[ id ] = state.results[ id ] || {
				prev: [],
				future: [],
				current: null,
			};

			if ( state.results[ id ].current ) {
				state.results[ id ].prev.push(
					state.results[ id ].current,
				);
			}

			state.results[ id ].current = { prompt, result };
		},
	},
} );
