import { useState } from 'react';
import { Dialog, Grid } from '@elementor/ui';
import Steps from './steps';
import Preview from './preview';

export default function WizardDialog() {
	const [ data, setData ] = useState( { pending: false, sections: [ { label: 'Introduction', value: 'introduction' }, { label: '', value: '' } ] } );
	const [ activeStep, setActiveStep ] = useState( 0 );

	console.log( '@@@ data', data );

	return (
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
				<Grid item xs={ 4 } sx={ { px: 10 } }>
					<Steps activeStep={ activeStep } setActiveStep={ setActiveStep } setData={ setData } data={ data } />
				</Grid>

				<Grid item xs={ 8 }>
					<Preview activeStep={ activeStep } data={ data } />
				</Grid>
			</Grid>
		</Dialog>
	);
}
