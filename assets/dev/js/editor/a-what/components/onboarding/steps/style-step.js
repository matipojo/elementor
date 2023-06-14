import { Box, Button } from '@elementor/ui';
import { updateGlobals } from '../../../api/calls';

export default function StyleStep() {
	const update = () => {
		updateGlobals( {} );
		console.log( 'update' );
	};

	return (
		<>
			StyleStep
			<Button onClick={ update }>Update</Button>
		</>
	);
}
