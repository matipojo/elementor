import Connect from './pages/connect';
import GetStarted from './pages/get-started';
import WizardDialog from './components/wizard-dialog';
import LayoutDialog from './pages/form-layout/components/layout-dialog';
import PropTypes from 'prop-types';
import { AttachmentPropType } from './types/attachment';
import { useConfig } from './pages/form-layout/context/config';
import {IframeWrapper} from "./utils/IframeWrapper";
import {useState} from "react";

const LayoutContent = ( props ) => {
	const { onClose, onConnect } = useConfig();
	const [, forceRefresh] = useState(0);

	if ( '1' !== window.ElementorAiConfig.is_connected ) {
		return (
			<WizardDialog onClose={ onClose }>
				<LayoutDialog onClose={ onClose } />

				<WizardDialog.Content dividers>
					<Connect
						connectUrl={ window.ElementorAiConfig.connect_url }
						onSuccess={ ( data ) => {
							onConnect( data );
							window.ElementorAiConfig.is_connected = true;
							forceRefresh(1);
						} }
					/>
				</WizardDialog.Content>
			</WizardDialog>
		);
	}

	if ( '1' !== window.ElementorAiConfig.is_get_started ) {
		return (
			<WizardDialog onClose={ onClose }>
				<LayoutDialog onClose={ onClose } />

				<WizardDialog.Content dividers>
					<GetStarted onSuccess={ () => {
						window.ElementorAiConfig.is_get_started = '1';
						forceRefresh(2);
					} } />
				</WizardDialog.Content>
			</WizardDialog>
		);
	}

	return (
		<IframeWrapper
			attachments={ props.attachments }
		/>
	);
};

LayoutContent.propTypes = {
	attachments: PropTypes.arrayOf( AttachmentPropType ),
};

export default LayoutContent;
