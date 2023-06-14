import { Dialog, Grid } from '@elementor/ui';
import Steps from './steps';
import Preview from './preview';

export default function WizardDialog() {
	const [ state, setState ] = useState( {} );

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
				<Grid item xs={ 4 }>
					<Steps setState={ setState } />
				</Grid>
				<Grid item xs={ 8 }>
					<Preview state={ state } />
				</Grid>
			</Grid>
		</Dialog>
	);
}
