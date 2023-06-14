import { Box, Stepper, Step, StepLabel, Typography, Button } from '@elementor/ui';
import DialogHeader from './dialog/dialog-header';
import { useState } from 'react';
import BusinessStep from './steps/business-step';
import StyleStep from './steps/style-step';
import BlocksStep from './steps/blocks-step';

export default function Steps() {
	const steps = [
		{
			label: 'Business Info',
			filler: <BusinessStep />,
		},
		{
			label: 'Look and Feel',
			filler: <StyleStep />,
		},
		{
			label: 'Building Blocks',
			filler: <BlocksStep />,
		},
	];

	const [ activeStep, setActiveStep ] = useState( 0 );
	const [ skipped, setSkipped ] = useState( new Set() );

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

	return (
		<Box sx={ { height: '100vh' } } >
			<DialogHeader />

			<Stepper activeStep={ activeStep } alternativeLabel sx={ { marginTop: 10, marginBottom: 10 } }>
				{ steps.map( ( step ) => (
					<Step key={ step.label }>
						<StepLabel>{ step.label }</StepLabel>
					</Step>
				) ) }
			</Stepper>

			<Box display="flex" justifyContent="center" sx={ { margin: 'auto', height: '50vh', width: '90%' } } >
				{ steps[ activeStep ].filler }
			</Box>

			<Box sx={ { display: 'flex', flexDirection: 'row', pt: 2 } }>
				<Button
					color="inherit"
					disabled={ 0 === activeStep }
					onClick={ handleBack }
					sx={ { mr: 1 } }
				>
					Back
				</Button>
				<Box sx={ { flex: '1 1 auto' } } />
				<Button onClick={ handleNext }>
					{ activeStep === steps.length - 1 ? 'Finish' : 'Next' }
				</Button>
			</Box>
		</Box>
	);
}
