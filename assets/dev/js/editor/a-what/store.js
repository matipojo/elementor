import { createSelector, createSlice } from '@elementor/store';

let id = 1;

const selectResults = ( state ) => state.aWhat.results;

export const selectElementResults = createSelector(
	selectResults,
	( state, elementId ) => elementId,
	( results, elementId ) => {
		const elementResults = Object.values( results ).filter( ( item ) => item.elementId === elementId );

		return {
			current: elementResults.find( ( item ) => 0 === item.position ) || null,
			past: elementResults.filter( ( item ) => item.position < 0 ),
			future: elementResults.filter( ( item ) => item.position > 0 ),
		};
	},
);

export const selectElementsIds = createSelector(
	selectResults,
	( results ) => Object.values( results ).reduce( ( acc, item ) => {
		if ( acc.includes( item.elementId ) ) {
			return acc;
		}

		acc.push( item.elementId );

		return acc;
	}, [] ),
);

export const slice = createSlice( {
	name: 'aWhat',
	initialState: {
		results: {},
	},
	reducers: {
		push( state, { payload: { elementId, prompt, result } } ) {
			const lastResult = Object.values( state.results )
				.find( ( item ) => item.elementId === elementId && 0 === item.position );

			if ( lastResult ) {
				lastResult.nextPrompt = prompt;
			} else {
				state.results[ id ] = {
					id,
					elementId,
					nextPrompt: prompt,
					result: null,
					position: 0,
				};

				id++;
			}

			Object.values( state.results ).forEach( ( item ) => {
				if ( item.elementId !== elementId ) {
					return;
				}

				item.position--;

				if ( item.position >= 0 ) {
					delete state.results[ item.id ];
				}
			} );

			state.results[ id ] = {
				id,
				elementId,
				result,
				nextPrompt: null,
				position: 0,
			};

			id++;
		},

		undo( state, { payload: { elementId } } ) {
			Object.values( state.results ).forEach( ( item ) => {
				if ( item.elementId !== elementId ) {
					return;
				}

				item.position++;
			} );
		},

		redo( state, { payload: { elementId } } ) {
			Object.values( state.results ).forEach( ( item ) => {
				if ( item.elementId !== elementId ) {
					return;
				}

				item.position--;
			} );
		},
	},
} );
