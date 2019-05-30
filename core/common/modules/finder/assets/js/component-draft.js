import FinderLayout from './modal-layout';

export default class extends elementorModules.Component {
	__construct( args ) {
		super.__construct( args );

		this.isModal = true;
	}

	getNamespace() {
		return 'finder';
	}

	getRoutes() {
		return {
			'': {
				callback: () => {/* nothing to do it's already rendered */},
				shortcut: {
					keys: 'ctrl+e',
				},
			},
		};
	}

	getCommands() {
		return {
			'navigate/down': {
				callback: () => this.getItemsView().activateNextItem(),
				shortcut: {
					keys: 'down',
				},
				scopes: [ this.getNamespace() ],
				dependency: () => {
					return this.getItemsView();
				},
			},
			'navigate/up': {
				callback: () => this.getItemsView().activateNextItem( true ),
				shortcut: {
					keys: 'up',
				},
				scopes: [ this.getNamespace() ],
				dependency: () => {
					return this.getItemsView();
				},
			},
			'navigate/select': {
				callback: ( event ) => this.getItemsView().goToActiveItem( event ),
				shortcut: {
					keys: 'enter',
				},
				scopes: [ this.getNamespace() ],
				dependency: () => {
					return this.getItemsView().$activeItem;
				},
			},
		};
	}

	open() {
		if ( ! this.layout ) {
			this.layout = new FinderLayout();
			this.layout.getModal().on( 'hide', () => elementorCommon.route.close( this.getNamespace() ) );
		}

		this.layout.showModal();

		return true;
	}

	close() {
		this.layout.getModal().hide();
	}

	getItemsView() {
		return this.layout.modalContent.currentView.content.currentView;
	}
}
