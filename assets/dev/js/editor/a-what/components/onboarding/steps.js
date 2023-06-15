import { Box, Stepper, Step, StepLabel, Stack, Button, CircularProgress } from '@elementor/ui';
import { useState } from 'react';
import BusinessStep from './steps/business-step';
import BlocksStep from './steps/blocks-step';
import StyleStep from './steps/style-step';
import { updateData, updateGlobals } from '../../api/calls';
import { AIIcon } from '@elementor/icons';
import defaultMessages from '../../api/messages';

const prompts = {
	hero: 'Create an enchanting hero section for a flower shop website that celebrates the beauty of nature and the art of floral arrangements. Incorporate stunning floral imagery, a captivating headline, and an irresistible invitation to explore the shop\'s vibrant collection of blooms. The hero section should entice visitors to indulge their senses and discover the perfect flowers for every occasion.',
	about: 'Create a row with a width of 1400px and a height of 80% of the viewport. The row has a subtle background gradient. Inside the row, place a centered column with a divider, a title, and a text paragraph. Next, create another row that spans the full width and has images aligned to the right with gap between elements. The images are of a flower shop Instagram style',
};

export default function Steps( { activeStep, setActiveStep, data, setData } ) {
	const [ skipped, setSkipped ] = useState( new Set() );
	const [ isButtonLoading, setIsButtonLoading ] = useState( false );

	const steps = [
		{
			label: 'Business Info',
			filler: <BusinessStep data={ data } setData={ setData } />,
		},
		{
			label: 'Building Blocks',
			filler: <BlocksStep data={ data } setData={ setData } />,
		},
		{
			label: 'Look and Feel',
			filler: <StyleStep data={ data } setData={ setData } />,
		},
	];

	const isStepSkipped = ( step ) => {
		return skipped.has( step );
	};

	const handleNext = () => {
		let newSkipped = skipped;
		if ( isStepSkipped( activeStep ) ) {
			newSkipped = new Set( newSkipped.values() );
			newSkipped.delete( activeStep );
		}

		setActiveStep( ( prevActiveStep ) => prevActiveStep + 1 );
		setSkipped( newSkipped );
	};

	const handleBack = () => {
		setActiveStep( ( prevActiveStep ) => prevActiveStep - 1 );
	};

	const handleFinish = () => {
		elementor.config.onboarding_data = {
			business_type: data.type.label,
			business_name: data.name ?? '',
			business_description: data.description ?? '',
		};

		setIsButtonLoading( true );

		Promise.all( [
			createBlock( 'hero' ),
			createBlock( 'about' ),

			updateGlobals( data.colors ),

			updateData( {
				business_type: data.type.label,
				business_name: data.name ?? '',
				business_description: data.description ?? '',
			} ),
		] )
			.then( ( [ hero, about ] ) => {
				localStorage.setItem( 'cache', JSON.stringify( {
					hero: {
						xml: hero,
						prompt: prompts.hero,
					},
					about: {
						xml: about,
						prompt: prompts.about,
					},
				} ) );
			} )
			.then( () => $e.run( 'document/save/publish', { force: true } ) )
			.then( () => {
				const url = new URL( window.location.href );

				url.searchParams.delete( 'onboarding' );

				window.location.href = url.href;
			} );
	};

	// Varda's Flowers Shop

	// A flower shop that sells flowers and bouquets for all occasions.

	return (
		<Box sx={ { height: '100vh' } } >
			<Stepper activeStep={ activeStep } alternativeLabel sx={ { py: 10 } }>
				{ steps.map( ( step ) => (
					<Step key={ step.label }>
						<StepLabel>{ step.label }</StepLabel>
					</Step>
				) ) }
			</Stepper>

			<Box display="flex" justifyContent="center" >
				{ steps[ activeStep ].filler }
			</Box>

			<Box display="flex" position="sticky" top="calc(100% - 72px)" sx={ { mt: 8 } }>
				{
					activeStep > 0 && (
						<Button
							color="secondary"
							disabled={ 0 === activeStep }
							onClick={ handleBack }
							sx={ { mr: 1 } }
						>
							Back
						</Button>
					)
				}

				<Stack direction="row" justifyContent="flex-end" flexGrow={ 1 } sx={ { mb: 6 } }>
					{
						activeStep === steps.length - 1
							? <Button variant="contained" onClick={ handleFinish } disabled={ ! data.colors || ! data.font || isButtonLoading } startIcon={ isButtonLoading ? <CircularProgress /> : <AIIcon /> }>
								Generate
							</Button>
							: <Button variant="contained" onClick={ handleNext } disabled={ ! data.type?.label || ! data.name || data.pending } startIcon={ data.pending && <CircularProgress color="secondary" size={ 20 } /> }>
								Next
							</Button>
					}
				</Stack>
			</Box>
		</Box>
	);
}

function createBlock( type ) {
	const prompt = prompts[ type ];
	return request( {
		body: {
			messages: [
				...defaultMessages,
				{
					role: 'user',
					content: `
						My website name: ${ window.elementor.config.onboarding_data.business_name }
						My website description: ${ window.elementor.config.onboarding_data.business_description }
						My prompt: ${ prompt }`,
				},
			],
		},
	} );
}

function request( { body: bodyData } ) {
	const body = {
		...bodyData,
		model: 'gpt-3.5-turbo',
	};

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${ elementorEditorV2Env[ '@elementor/a-what' ].apiKey }`,
	};

	return fetch( elementorEditorV2Env[ '@elementor/a-what' ].apiURL, {
		method: 'POST',
		headers,
		body: JSON.stringify( body ),
	} )
		.then( ( response ) => response.json() )
		.then( ( data ) => data.choices[ 0 ].message.content )
		.catch( ( error ) => console.log( error ) );
}
