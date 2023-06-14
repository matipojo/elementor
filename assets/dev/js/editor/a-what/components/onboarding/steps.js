import { Box, Stepper, Step, StepLabel, Stack, Button, CircularProgress } from '@elementor/ui';
import { useState } from 'react';
import BusinessStep from './steps/business-step';
import BlocksStep from './steps/blocks-step';
import StyleStep from './steps/style-step';
import { updateGlobals } from '../../api/calls';
import { AIIcon } from '@elementor/icons';

export default function Steps( { activeStep, setActiveStep, data, setData } ) {
	const [ skipped, setSkipped ] = useState( new Set() );

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
		console.log( 'data', data );

		updateGlobals( {
			primary_color: '#75976A',
			secondary_color: '#CCCFD8',
			text_color: '#586264',
			accent_color: '#CC5B76',
		} );
	};

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

				<Stack direction="row" justifyContent="flex-end" flexGrow={ 1 }>
					{
						activeStep === steps.length - 1
							? <Button variant="contained" onClick={ handleFinish } startIcon={ <AIIcon /> }>
								Generate
							</Button>
							: <Button variant="contained" onClick={ handleNext } disabled={ ! data.type?.label || data.pending } startIcon={ data.pending && <CircularProgress color="secondary" size={ 20 } /> }>
								Next
							</Button>
					}
				</Stack>
			</Box>
		</Box>
	);
}
