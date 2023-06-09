import * as hooks from './hooks';

export default class Component extends $e.modules.ComponentBase {
	getNamespace() {
		return 'a-what';
	}

	defaultHooks() {
		return this.importHooks( hooks );
	}
}
