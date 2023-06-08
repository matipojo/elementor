import { Box, Button, Drawer, TextField } from '@elementor/ui';

export default function PromptModal( { open, onClose } ) {
	return (
		<Drawer
			anchor="bottom"
			open={ open }
			onClose={ onClose }
		>
			<Box sx={ { padding: '20px', display: 'flex' } }>
				<TextField sx={ { width: '100%' } } />
				<Button variant="contained">
					Generate
				</Button>
			</Box>
		</Drawer>
	);
}
