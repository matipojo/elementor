import { Box, Typography, Select, MenuItem, InputLabel, FormControl, TextField } from '@elementor/ui';
import { useState } from 'react';

export default function BusinessStep() {
	const [ businessType, setBusinessType ] = useState( '' );

	const handleChange = () => setBusinessType( event.target.value );

	return (
		<Box display="flex" flexDirection="column">
			<Typography variant="h2">
				Let's get down to business
			</Typography>

			<FormControl fullWidth sx={ { minWidth: 250 } }>
				<Typography variant="body2" sx={ { marginTop: 4 } }>
					What kind of business do you have?
				</Typography>
				<Box sx={ { minWidth: 120 } }>
					<InputLabel id="demo-simple-select-label">Input Label</InputLabel>
					<Select
						onChange={ handleChange }
						value={ businessType }
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						label="Input Label"
						MenuProps={ {
							MenuListProps: {
								sx: {
									minWidth: 150,
								},
							},
							anchorOrigin: {
								vertical: 'bottom',
								horizontal: 'left',
							},
							transformOrigin: {
								vertical: 'top',
								horizontal: 'left',
							},
						} }
					>
						<MenuItem value={ 10 }>Ten</MenuItem>
						<MenuItem value={ 20 }>Twenty</MenuItem>
						<MenuItem value={ 30 }>Third</MenuItem>
					</Select>
				</Box>
				<Typography variant="body2" sx={ { marginTop: 4 } }>
					What kind of business do you have?
				</Typography>
				<TextField color="primary" type="text" size="small" id="outlined-basic" defaultValue="My incredible business" variant="outlined" />
				<Typography variant="body2" sx={ { marginTop: 4 } }>
					What kind of business do you have?
				</Typography>
				<TextField color="primary" type="text" size="small" id="outlined-basic" defaultValue="My incredible business" variant="outlined" />
			</FormControl>
		</Box>
	);
}
