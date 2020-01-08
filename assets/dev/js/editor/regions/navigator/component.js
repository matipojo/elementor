import BaseComponent from 'elementor-common/components/component';

export default class Component extends BaseComponent {
	getNamespace() {
		return 'navigator';
	}

	defaultRoutes() {
		return {
			'': () => {},
		};
	}

	defaultCommands() {
		return {
			open: () => $e.route( this.getNamespace() ),
			close: () => this.close(),
			toggle: () => {
				if ( this.isOpen ) {
					this.close();
				} else {
					$e.route( this.getNamespace() );
				}
			},
		};
	}

	defaultShortcuts() {
		return {
			toggle: {
				keys: 'ctrl+i',
				dependency: () => elementor.getPreviewContainer().isEditable(),
			},
		};
	}

	open( args ) {
		const { model = false } = args;

		this.manager.open( model );
		return true;
	}

	close() {
		if ( ! super.close() ) {
			return false;
		}

		this.manager.close();

		return true;
	}
}
