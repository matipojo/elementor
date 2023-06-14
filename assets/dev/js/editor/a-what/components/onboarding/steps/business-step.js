import { useState } from 'react';
import { Box, Typography, FormControl, TextField, Stack, Autocomplete } from '@elementor/ui';

const siteTypes = [
	{ label: 'Marketing' },
	{ label: 'Websites Agency' },
];

export default function BusinessStep( { setData } ) {
	const setState = ( key, value ) => setData( ( prev ) => ( { ...prev, [ key ]: value } ) );

	const handleType = ( e ) => setState( 'businessType', siteTypes[ e.target.value ] );
	const handleName = ( e ) => setState( 'businessName', e.target.value );
	const handleDescription = ( e ) => setState( 'businessDescription', e.target.value );

	return (
		<Stack spacing={ 7 } width="100%">
			<Typography variant="h4">
				Let's get down to business
			</Typography>

			<FormControl fullWidth>
				<Stack spacing={ 7 }>
					<Stack spacing={ 4 }>
						<Typography variant="h6" sx={ { fontWeight: 'bold', mt: 4 } }>
							What’s your site about?
						</Typography>

						<Box sx={ { minWidth: 120 } }>
							<Autocomplete
								fullWidth
								disablePortal
								id="combo-box-demo"
								options={ siteTypes }
								renderInput={ ( params ) => <TextField color="secondary" { ...params } label="Movie" /> }
								onChange={ handleType }
								color="secondary"
							/>
						</Box>
					</Stack>

					<Stack spacing={ 4 }>
						<Typography variant="h6">
							What’s your business name?
						</Typography>

						<TextField
							color="secondary"
							type="text"
							id="outlined-basic"
							placeholder="My incredible business"
							variant="outlined"
							onChange={ handleName }
						/>
					</Stack>

					<Stack spacing={ 4 }>
						<Typography variant="h6">
							Describe your business (optional)
						</Typography>

						<TextField
							multiline
							minRows={ 8 }
							maxRows={ 8 }
							color="secondary"
							type="text"
							id="outlined-basic"
							variant="outlined"
							placeholder="A dynamic and collaborative creative agency that brings ideas to life through captivating visuals and digital experiences. We specialize in crafting unique brand identities, immersive websites, and engaging social media content. We deliver exceptional results that reflect our clients' brand personalities and resonate with their target audience."
							onChange={ handleDescription }
						/>
					</Stack>
				</Stack>
			</FormControl>
		</Stack>
	);
}
