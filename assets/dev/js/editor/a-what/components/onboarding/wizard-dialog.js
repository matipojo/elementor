import { Dialog, Grid } from '@elementor/ui';
import Steps from './steps';
import Placeholder from './placeholder';

export default function WizardDialog() {
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
				<Grid item xs={ 8 }>
					<Steps />
				</Grid>
				<Grid item xs={ 4 }>
					<Placeholder />
				</Grid>
			</Grid>
		</Dialog>
	);
}
