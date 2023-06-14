import { Stack, Typography, Button, Box, styled } from '@elementor/ui';

const ColorCircle = styled( Box, { name: 'color-circle' } )( ( { theme, color } ) => ( {
	width: theme.sizing[ 300 ],
	height: theme.sizing[ 300 ],
	borderRadius: theme.border.radius.circle,
	backgroundColor: color,
	border: `1px solid ${ theme.palette.common.white }`,
} ) );

export default function StyleStep( { data, setData } ) {
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

					<Stack direction="row" justifyContent="space-between">
						<Box>
							<Button variant="outlined" color="secondary" sx={ { width: 120, py: 10 } }>
								<Stack direction="row" spacing={ -3 }>
									{
										[ '#F5F5F5', '#F5f', '#F5aa', '#aaff' ].map( ( color ) => (
											<ColorCircle key={ color } color={ color } />
										) )
									}
								</Stack>
							</Button>

							<Typography variant="body2" align="center" sx={ { mt: 3 } }>Vibrant</Typography>
						</Box>

						<Box>
							<Button variant="outlined" color="secondary" sx={ { width: 120, py: 10 } }>
								<Stack direction="row" spacing={ -3 }>
									{
										[ '#F5F5F5', '#F5f', '#F5aa', '#aaff' ].map( ( color ) => (
											<ColorCircle key={ color } color={ color } />
										) )
									}
								</Stack>
							</Button>

							<Typography variant="body2" align="center" sx={ { mt: 3 } }>Modern</Typography>
						</Box>

						<Box>
							<Button variant="outlined" color="secondary" sx={ { width: 120, py: 10 } }>
								<Stack direction="row" spacing={ -3 }>
									{
										[ '#F5F5F5', '#F5f', '#F5aa', '#aaff' ].map( ( color ) => (
											<ColorCircle key={ color } color={ color } />
										) )
									}
								</Stack>
							</Button>

							<Typography variant="body2" align="center" sx={ { mt: 3 } }>Serene</Typography>
						</Box>
					</Stack>
				</Stack>

				<Stack spacing={ 4 }>
					<Typography variant="h6" sx={ { fontWeight: 'bold', mt: 4 } }>
						Choose a font
					</Typography>

					<Stack direction="row" justifyContent="space-between">
						<Box>
							<Button variant="outlined" color="secondary" sx={ { width: 120, py: 12 } }>
								<Stack>
									<Typography variant="h6" sx={ { fontWeight: 'bold', mb: 3 } }>Titles</Typography>
									<Typography variant="body2" sx={ { mb: 3 } }>body text</Typography>

									<Button sx={ { mt: 2 } } color="secondary" variant="contained" size="small">Button text</Button>
								</Stack>
							</Button>

							<Typography variant="body2" align="center" sx={ { mt: 3 } }>Creative</Typography>
						</Box>

						<Box>
							<Button variant="outlined" color="secondary" sx={ { width: 120, py: 12 } }>
								<Stack>
									<Typography variant="h6" sx={ { fontWeight: 'bold', mb: 3 } }>Titles</Typography>
									<Typography variant="body2" sx={ { mb: 3 } }>body text</Typography>

									<Button sx={ { mt: 2 } } color="secondary" variant="contained" size="small">Button text</Button>
								</Stack>
							</Button>

							<Typography variant="body2" align="center" sx={ { mt: 3 } }>Elegant</Typography>
						</Box>

						<Box>
							<Button variant="outlined" color="secondary" sx={ { width: 120, py: 12 } }>
								<Stack>
									<Typography variant="h6" sx={ { fontWeight: 'bold', mb: 3 } }>Titles</Typography>
									<Typography variant="body2" sx={ { mb: 3 } }>body text</Typography>

									<Button sx={ { mt: 2 } } color="secondary" variant="contained" size="small">Button text</Button>
								</Stack>
							</Button>

							<Typography variant="body2" align="center" sx={ { mt: 3 } }>Minimal</Typography>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
}
