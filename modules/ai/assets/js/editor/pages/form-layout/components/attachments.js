import { useState } from 'react';
import { Menu } from './attachments/menu';
import UrlAttachment from './attachments/url-attachment';
import WebsiteIcon from '../../../icons/website-icon';
import { __ } from '@wordpress/i18n';
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
					items={ [ {
						title: __( 'URL as a reference', 'elementor' ),
						icon: WebsiteIcon,
						type: 'url',
					} ] }
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
