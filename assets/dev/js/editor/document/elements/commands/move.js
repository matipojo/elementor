import Base from '../../commands/base';
import Container from '../../../container/container';

// Move.
export default class extends Base {
	validateArgs( args ) {
		this.requireContainer( args );
		this.requireArgumentInstance( 'target', Container, args );
	}

	getHistory( args ) {
		const { containers = [ args.container ] } = args;

		return {
			containers,
			type: 'move',
		};
	}

	apply( args ) {
		const { target, options = {}, containers = [ args.container ] } = args,
			reCreate = [];

		containers.forEach( ( container ) => {
			reCreate.push( container.model.toJSON() );

			$e.run( 'document/elements/delete', { container } );
		} );

		let count = 0;
		reCreate.forEach( ( model ) => {
			// If multiple fix position.
			if ( options.hasOwnProperty( 'at' ) && reCreate.length > 1 ) {
				if ( 0 !== count ) {
					options.at += count;
				}
			}

			$e.run( 'document/elements/create', {
				container: target,
				model,
				options,
				returnValue: true,
			} );

			count++;
		} );
	}
}