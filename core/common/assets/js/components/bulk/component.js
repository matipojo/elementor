import ComponentBase from 'elementor-api/modules/component-base';

import * as commandsData from './commands/data/';

export default class Component extends ComponentBase {
	__construct( args = {} ) {
		super.__construct( args );
	}

	getNamespace() {
		return 'bulk';
	}

	defaultData() {
		return this.importCommands( commandsData );
	}
}
