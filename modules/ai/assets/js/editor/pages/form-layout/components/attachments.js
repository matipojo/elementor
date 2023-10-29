import { useState } from 'react';
import { Menu } from './attachments/menu';
import UrlAttachment from './attachments/url-attachment';
import PropTypes from 'prop-types';

const ATTACHMENT_TYPE_URL = 'url';

const Attachments = ( { attachments, onAttach, onDetach, disabled } ) => {
	const [ currentAttachmentType, setCurrentAttachmentType ] = useState( null );
	const showMenu = ! currentAttachmentType;

	return (
		<>
			{
				showMenu && <Menu
					disabled={ disabled }
					onSelect={ ( type ) => {
						setCurrentAttachmentType( type );
					} }
				/>
			}

			{
				ATTACHMENT_TYPE_URL === currentAttachmentType &&
				<UrlAttachment
					disabled={ disabled }
					attachments={ attachments }
					onAttach={ onAttach }
					onDetach={ () => {
						setCurrentAttachmentType( null );
						onDetach();
					} }
				/> }
		</>
	);
};

Attachments.propTypes = {
	attachments: PropTypes.array,
	onAttach: PropTypes.func,
	onDetach: PropTypes.func,
	disabled: PropTypes.bool,
};

export default Attachments;
