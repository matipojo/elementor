import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {AttachmentPropType} from "../types/attachment";
import LayoutDialog from "../pages/form-layout/components/layout-dialog";
import {useConfig} from "../pages/form-layout/context/config";
import Loader from "../components/loader";
import {Alert, Stack} from "@elementor/ui";
import ErrorIcon from "../icons/error-icon";

export const IframeWrapper = (props) => {
	const {onClose, onInsert, onGenerate, onSelect} = useConfig();
	const [isTimeout, setIsTimeout] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		window.addEventListener('message', (event) => {
			if ('text-to-elementor/loaded' === event.data.type) {
				setIsTimeout(false);
				setIsLoaded(true);
			}
		});

		setTimeout(() => {
			setIsTimeout(true);
		}, 10_000);

		window.dispatchEvent(new CustomEvent('elementor/ai/layout/button/click', {
			detail: {
				onClose,
				onInsert,
				onGenerate,
				onSelect,
			},
		}));
	}, []);

	return (
		<LayoutDialog
			onClose={onClose}
			PaperProps={isLoaded ? {
				elevation: 0,
				sx: {
					backgroundColor: 'transparent',
				},
			} : {
				elevation: 6,
			}}
		>
			<LayoutDialog.Content>
				{(!isLoaded) && <div
					id="text-to-elementor-iframe-loader"
				>
					<LayoutDialog.Header
						onClose={onClose}
					/>

					{(!isTimeout) && <Loader
						BoxProps={{sx: {px: 3}}}
					/>}

					{(isTimeout) && <Stack
						padding={2}
					>
						<Alert
							color={'error'}
							icon={<ErrorIcon/>}
						>
							{__('The app could not be loaded')}
						</Alert>
					</Stack>}
				</div>}
			</LayoutDialog.Content>
		</LayoutDialog>
	);
};

IframeWrapper.propTypes = {
	DialogHeaderProps: PropTypes.object,
	DialogContentProps: PropTypes.object,
	attachments: PropTypes.arrayOf(AttachmentPropType),
};
