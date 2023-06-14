import { useState } from 'react';
import { Stack, Typography, Button, Box, styled } from '@elementor/ui';

const ColorCircle = styled( Box, { name: 'color-circle' } )( ( { theme, color } ) => ( {
	width: theme.sizing[ 300 ],
	height: theme.sizing[ 300 ],
	borderRadius: theme.border.radius.circle,
	backgroundColor: color,
	border: `1px solid ${ theme.palette.common.white }`,
	boxShadow: `0px 0px 3px 3px rgba(0, 0, 0, 0.25)`,
} ) );

export default function StyleStep( { data, setData } ) {
	const [ selectedColors, setSelectedColors ] = useState( null );
	const [ selectedFont, setSelectedFont ] = useState( null );

	const colors = data.palette;

	console.log( '@@@ colors', colors );

	const fonts = [
		{
			label: 'Creative',
			value: 'creative',
		},
		{
			label: 'Elegant',
			value: 'elegant',
		},
		{
			label: 'Minimal',
			value: 'minimal',
		},
	];

	const handleColors = ( index ) => {
		setData( ( prev ) => ( { ...prev, colors: colors[ index ] } ) );
		setSelectedColors( index );
	};
	const handleFont = ( index ) => {
		setData( ( prev ) => ( { ...prev, font: fonts[ index ].value } ) );
		setSelectedFont( index );
	};

	return (
		<Stack spacing={ 7 } width="100%">
			<Stack>
				<Typography variant="h4" sx={ { mb: 3 } }>
					Never go out of style
				</Typography>
				<Typography variant="subtitle1">
					These styles are recommended by our AI.
				</Typography>
				<Typography variant="subtitle1">
					You can always change them later.
				</Typography>
			</Stack>

			<Stack spacing={ 7 }>
				<Stack spacing={ 4 }>
					<Typography variant="h6" sx={ { fontWeight: 'bold', mt: 4 } }>
						Choose a color palette
					</Typography>

					<Stack direction="row" justifyContent="center" spacing={ 4 }>
						{
							colors.map( ( colorRow, index ) => (
								<Box key={ index }>
									<Button
										onClick={ () => handleColors( index ) }
										variant="outlined"
										color="secondary"
										sx={ { maxWidth: 150, py: 10, opacity: selectedColors && selectedColors !== index ? '0.25' : '1' } }
										disabled={ selectedColors && selectedColors !== index }
									>
										<Stack direction="row" spacing={ -3 }>
											{
												Object.values( colorRow ).map( ( color ) => (
													<ColorCircle key={ color } color={ color } />
												) )
											}
										</Stack>
									</Button>
								</Box>
							) )
						}
					</Stack>
				</Stack>

				<Stack spacing={ 4 }>
					<Typography variant="h6" sx={ { fontWeight: 'bold', mt: 4 } }>
						Choose a font pairing
					</Typography>

					<Stack direction="row" justifyContent="center" spacing={ 4 }>
						{
							fonts.map( ( { value }, index ) => (
								<Box key={ value }>
									<Button
										variant="outlined"
										color="secondary"
										sx={ { maxWidth: 150, py: 12, px: 3, opacity: selectedFont && selectedFont !== index ? '0.25' : '1' } }
										onClick={ () => handleFont( index ) }
										disabled={ selectedFont && selectedFont !== index }
									>
										<Stack>
											<Typography variant="h6" sx={ { fontWeight: 'bold', mb: 3 } }>Titles</Typography>
											<Typography variant="body2" sx={ { mb: 3 } }>body text</Typography>

											<Button sx={ { mt: 2 } } color="secondary" variant="contained" size="small">Button text</Button>
										</Stack>
									</Button>
								</Box>
							) )
						}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
}
