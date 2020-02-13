export class DisableKitStyle extends $e.modules.hookUI.After {
	getCommand() {
		return 'document/elements/settings';
	}

	getId() {
		return 'kit-disable-style';
	}

	getContainerType() {
		return 'document';
	}

	getConditions( args ) {
		return args.settings.post_status;
	}

	apply( args ) {
		const bodyClass = args.container.document.config.panel.body_class,
			state = 'draft' !== args.settings.post_status;

		elementor.$previewContents.find( 'body' ).toggleClass( bodyClass, state );
	}
}

export default DisableKitStyle;
