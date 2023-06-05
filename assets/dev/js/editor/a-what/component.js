import ComponentBase from 'elementor-api/modules/component-base';
import * as hooks from './hooks';

export default class Component extends ComponentBase {
	getNamespace() {
		return 'a-what';
	}

	defaultHooks() {
		return this.importHooks( hooks );
	}
}
