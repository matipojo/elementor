import React, {useEffect, useRef, useState} from 'react';
import PropTypes from "prop-types";
import {AttachmentPropType} from "../types/attachment";
import LayoutDialog from "../pages/form-layout/components/layout-dialog";
import {useConfig} from "../pages/form-layout/context/config";
import Loader from "../components/loader";
import {Paper} from "@elementor/ui";

export const IframeWrapper = (props) => {
	const {onClose, onInsert, onGenerate, onSelect} = useConfig();

	useEffect(() => {
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
		>
			<div
				id="text-to-elementor-iframe-wrapper-header"
				style={{
					height: '32px',
					position: 'absolute',
					width: 'calc(100% - 165px)',
					top: '15px',
					left: '15px',
					zIndex: 1,
					cursor: 'move',
				}}
			/>
			<LayoutDialog.Content>
				<div
					id="text-to-elementor-iframe-loader"
				>
					<Paper
						elevation={6}
						>
					<LayoutDialog.Header
						onClose={ onClose }

					/>
					<Loader
						BoxProps={ { sx: { px: 3 } } }
					/>
					</Paper>
				</div>

				<div
					id={'text-to-elementor-iframe-wrapper'}
				>
				</div>
			</LayoutDialog.Content>
		</LayoutDialog>
	);
};

IframeWrapper.propTypes = {
	DialogHeaderProps: PropTypes.object,
	DialogContentProps: PropTypes.object,
	attachments: PropTypes.arrayOf(AttachmentPropType),
};
