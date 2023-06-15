import { useEffect } from 'react';
import { Stack, Typography, Autocomplete, TextField, Button } from '@elementor/ui';
import PlusIcon from '../../../icons/plus-icon';
import { env } from '../../../env';

const sectionTypes = [
	{
		label: 'Introduction',
		value: 'introduction',
	},
	{
		label: 'About',
		value: 'about',
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
	const fallbackColors =	[
		{
			primary: '#815034',
			secondary: '#cfb6a2',
			text: '#000000',
			accent: '#cc9e7b',
		},
		{
			primary: '#364f6b',
			secondary: '#f5f5f5',
			text: '#000000',
			accent: '#fc5185',
		},
		{
			primary: '#f7a541',
			secondary: '#ffffff',
			text: '#000000',
			accent: '#ffa07a',
		},
		{
			primary: '#f26d6d',
			secondary: '#ffa07a',
			text: '#000000',
			accent: '#8A9CA4',
		},
		{
			primary: '#4682B4',
			secondary: '#ffffff',
			text: '#000000',
			accent: '#ffd700',
		},
		{
			primary: '#4c586f',
			secondary: '#dbe9f6',
			text: '#000000',
			accent: '#27a9e3',
		},
	];

	const request = ( businessType ) => {
		const body = {
			messages: [
				{
					role: 'user',
					content: `
							Create 6 unique modern color palettes, that will match my business of ${ businessType } each containing four colors.
							The first 2 palettes should be modern style, the second 2 palettes should be pastel style, the third 2 palettes should be vivid style.
							Be creative and use any combination of colors that should match together.
							return only a json in the following structure: [ { primary: '', secondary: '', text: '', accent: ''} ] without and other text.
							the color of the text should be black.`,
				},
			],
			model: 'gpt-3.5-turbo',
		};

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${ env.apiKey }`,
		};

		return fetch( env.apiURL, {
			method: 'POST',
			headers,
			body: JSON.stringify( body ),
		} )
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				try {
					return JSON.parse( data.choices[ 0 ].message.content );
				} catch ( e ) {
					return fallbackColors;
				}
			} )
			.catch( ( error ) => console.log( error ) );
	};

	useEffect( () => {
		setData( ( prev ) => ( { ...prev, pending: true } ) );

		request( data.type.label ).then( ( response ) => {
			setData( ( prev ) => ( { ...prev, palette: response, pending: false } ) );
		} );
	}, [] );

	const handleSection = ( index, label, value ) => {
		setData( ( prevState ) => {
			const newState = { ...prevState, sections: [ ...prevState.sections ] };

			newState.sections[ index ] = { ...newState.sections[ index ], label, value };

			return newState;
		} );
	};

	return (
		<Stack spacing={ 8 } width="100%">
			<Stack spacing={ 4 }>
				<img
					src={ `${ elementorCommonConfig.urls.assets }images/ai/homepage.png` }
					alt="Blocks"
					style={ { width: '32px', height: 'auto' } }
				/>

				<Stack>
					<Typography variant="h4" sx={ { mb: 3 } }>
						Home is where… we start
					</Typography>
					<Typography variant="subtitle1">
						Imagine your homepage section-by-section, selecting the ones you wish to generate.
					</Typography>
				</Stack>
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
								renderInput={ ( params ) => <TextField color="secondary" { ...params } placeholder="Select a section type" /> }
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
