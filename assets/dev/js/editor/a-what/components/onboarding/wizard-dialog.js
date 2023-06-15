import { useState, useEffect } from 'react';
import { Dialog, Grid, DialogTitle, Stack, DialogContent, Typography, SvgIcon, styled, Box, Button } from '@elementor/ui';
import Steps from './steps';
import Preview from './preview';
import { AIIcon } from '@elementor/icons';

const ElementorLogo = ( props ) => {
	return (
		<SvgIcon viewBox="0 0 32 32" { ...props }>
			<path fillRule="evenodd" clipRule="evenodd" d="M2.69648 24.8891C0.938383 22.2579 0 19.1645 0 16C0 11.7566 1.68571 7.68687 4.68629 4.68629C7.68687 1.68571 11.7566 0 16 0C19.1645 0 22.2579 0.938383 24.8891 2.69648C27.5203 4.45459 29.5711 6.95344 30.7821 9.87706C31.9931 12.8007 32.3099 16.0177 31.6926 19.1214C31.0752 22.2251 29.5514 25.0761 27.3137 27.3137C25.0761 29.5514 22.2251 31.0752 19.1214 31.6926C16.0177 32.3099 12.8007 31.9931 9.87706 30.7821C6.95344 29.5711 4.45459 27.5203 2.69648 24.8891ZM12.0006 9.33281H9.33437V22.6665H12.0006V9.33281ZM22.6657 9.33281H14.6669V11.9991H22.6657V9.33281ZM22.6657 14.6654H14.6669V17.3316H22.6657V14.6654ZM22.6657 20.0003H14.6669V22.6665H22.6657V20.0003Z" />
		</SvgIcon>
	);
};

const StyledElementorLogo = styled( ElementorLogo )( ( { theme } ) => ( {
	width: theme.sizing[ '400' ],
	height: theme.sizing[ '400' ],
	'& path': {
		fill: theme.palette.text.primary,
	},
} ) );

const checkoutOptions = [
	{
		label: 'I’m bold!',
		description: 'Start from scratch',
		Icon: null,
		emoji: `${ elementorCommonConfig.urls.assets }images/ai/scratch.png`,
	},
	{
		label: 'I’m a boomer',
		description: 'Use a kit',
		Icon: null,
		emoji: `${ elementorCommonConfig.urls.assets }images/ai/kit.png`,
	},
	{
		label: 'It’s 2023',
		description: 'Kickstart with AI',
		Icon: AIIcon,
		emoji: `${ elementorCommonConfig.urls.assets }images/ai/ai.png`,
	},
];

export default function WizardDialog() {
	const [ data, setData ] = useState( { pending: false, sections: [ { label: 'Introduction', value: 'introduction' }, { label: '', value: '' } ] } );
	const [ activeStep, setActiveStep ] = useState( 0 );
	const [ afterThankYou, setAfterThankYou ] = useState( false );
	const [ selectedCheckoutOption, setSelectedCheckoutOption ] = useState( null );

	console.log( '@@@ data', data );

	useEffect( () => {
		elementor.helpers.enqueueFont( 'Space Mono', 'editor' );
		elementor.helpers.enqueueFont( 'Lobster', 'editor' );
		elementor.helpers.enqueueFont( 'Open Sans', 'editor' );
	}, [] );

	return (
		<>
			{
				afterThankYou ? (
					<Dialog
						open={ true }
						fullScreen={ true }
						PaperProps={ {
							sx: {
								height: '100vh',
								maxWidth: '100vw',
							},
						} }
						sx={ { zIndex: 9999 } }
					>
						<Grid container spacing={ 0 }>
							<Grid item xs={ 6 } md={ 4 } sx={ { px: 10 } }>
								<Steps activeStep={ activeStep } setActiveStep={ setActiveStep } setData={ setData } data={ data } />
							</Grid>

							<Grid item xs={ 6 } md={ 8 }>
								<Preview activeStep={ activeStep } data={ data } />
							</Grid>
						</Grid>
					</Dialog>
				) : (
					<Dialog
						open={ true }
						fullScreen={ true }
						PaperProps={ {
							sx: {
								height: '100vh',
								maxWidth: '100vw',
							},
						} }
						sx={ { zIndex: 9999 } }
					>
						<DialogTitle>
							<Stack direction="row" alignItems="center" spacing={ 3 }>
								<StyledElementorLogo />

								<Typography variant="body1" sx={ { fontWeight: 'bold' } }>CHECKOUT</Typography>
							</Stack>
						</DialogTitle>

						<DialogContent dividers>
							<Stack direction="row" justifyContent="center" alignItems="center" height="100%">
								<Stack spacing={ 8 }>
									<Typography variant="h6" align="center" sx={ { fontWeight: 'normal' } }>Thank you, Ariel. You're good to go!</Typography>

									<Typography variant="h4" align="center">How do you want to create your site?</Typography>

									<Stack direction="row" spacing={ 8 } justifyContent="center">
										{
											checkoutOptions.map( ( { label, description, Icon, emoji }, index ) => (
												<Box key={ index }>
													<Button
														variant="outlined"
														color="secondary"
														sx={ { flexDirection: 'column', height: 'auto', width: 250, py: 10, px: 3, borderColor: Number.isInteger( selectedCheckoutOption ) && selectedCheckoutOption === index ? 'secondary.dark' : 'secondary.background' } }
														onClick={ () => setAfterThankYou( true ) }
													>
														<Box>
															<img src={ emoji } alt={ label } width="100%" style={ { width: 80, height: 'auto' } } />
														</Box>

														<Stack spacing={ 2 }>
															<Typography variant="h6" sx={ { fontWeight: 'normal' } }>{ label }</Typography>
															<Typography variant="h4" sx={ { fontWeight: 'body' } }>{ description }{ Icon && <Icon fontSize="large" sx={ { ml: 2 } } /> }</Typography>
														</Stack>
													</Button>
												</Box>
											) )
										}
									</Stack>
								</Stack>
							</Stack>
						</DialogContent>
					</Dialog>
				)
			}
		</>
	);
}
