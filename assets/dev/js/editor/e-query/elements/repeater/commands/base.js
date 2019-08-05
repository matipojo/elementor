import CommandsBase from '../../commands/base';

// Import for documentation
import Repeater from '../repeater'; // eslint-disable-line

export default class Base extends CommandsBase {
	/**
	 * eQuery repeater.
	 *
	 * @type {Repeater}
	 */
	repeater = null;

	/**
	 * Should i reset repeater index, after run?
	 *
	 * @type {Boolean}
	 */
	resetIndexFlag = true;

	/**
	 * Function constructor().
	 *
	 * Create repeater base command.
	 *
	 * @param {*} receiver
	 */
	constructor( receiver ) {
		super( receiver, false );

		this.repeater = receiver;

		this.initialize();
	}

	/**
	 * Function run().
	 *
	 * Run the command.
	 *
	 * @param {{}} args
	 */
	run( args ) {
		const affected = super.run( args );

		if ( this.resetIndexFlag ) {
			this.repeater.setIndex( null );
		}

		return affected;
	}
}
