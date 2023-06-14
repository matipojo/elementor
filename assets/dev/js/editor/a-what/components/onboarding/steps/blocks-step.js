import { useState } from 'react';
import { Stack, Typography, Autocomplete, TextField, Button } from '@elementor/ui';
import PlusIcon from '../../../icons/plus-icon';

const sectionTypes = [
	{
		label: 'Introduction',
		value: 'introduction',
	},
	{
		label: 'About us',
		value: 'about-us',
	},
	{
		label: 'Forms',
		value: 'forms',
	},
	{
		label: 'Services',
		value: 'services',
	},
	{
		label: 'Contact us',
		value: 'contact-us',
	},
];

export default function BlocksStep( { data, setData } ) {
	const handleSection = ( index, label, value ) => {
		setData( ( prevState ) => {
			const newState = { ...prevState, sections: [ ...prevState.sections ] };

			newState.sections[ index ] = { ...newState.sections[ index ], label, value };

			return newState;
		} );
	};

	return (
		<Stack spacing={ 7 } width="100%">
			<Stack>
				<Typography variant="h4" sx={ { mb: 3 } }>
					Home is where… we start
				</Typography>
				<Typography variant="subtitle1">
					Imagine your homepage section-by-section, selecting the ones you wish to generate.
				</Typography>
			</Stack>

			<Stack spacing={ 7 }>
				{
					Array( 2 ).fill( 0 ).map( ( _, index ) => (
						<Stack spacing={ 4 } key={ index }>
							<Typography variant="h6" sx={ { fontWeight: 'bold', mt: 4 } }>
								Section { index + 1 }
							</Typography>

							<Autocomplete
								value={ data.sections[ index ].label }
								fullWidth
								disablePortal
								id="combo-box-demo"
								options={ sectionTypes }
								renderInput={ ( params ) => <TextField color="secondary" { ...params } label="Select a section type" /> }
								onChange={ ( e, { label, value } ) => handleSection( index, label, value ) }
								color="secondary"
							/>
						</Stack>
					) )
				}
			</Stack>

			<Stack spacing={ 3 } sx={ { pt: 12 } }>
				<Stack direction="row" justifyContent="center">
					<Button color="secondary" startIcon={ <PlusIcon /> }>Add section</Button>
				</Stack>

				<Typography variant="subtitle1" align="center" color="secondary">
					No worries, you can always add sections later.
				</Typography>
			</Stack>
		</Stack>
	);
}
