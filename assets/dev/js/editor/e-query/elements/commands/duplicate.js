import Base from './base';
import { Create } from './commands';

export default class Duplicate extends Base {
	/**
	 * Function apply().
	 *
	 * Do the actual command.
	 *
	 * @param {*} element
	 * @param {Array} args
	 *
	 * @returns {{}} ( Appended element )
	 */
	apply( element, args ) {
		const model = element.model.clone();



		return model;
	}

	/**
	 * Function logHistory().
	 *
	 * Log command history.
	 *
	 * @param {Array} args
	 */
	logHistory( args ) {

	}
}
