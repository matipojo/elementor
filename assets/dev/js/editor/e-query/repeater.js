export default class Repeater  {
	add( subElement, at ) {
		this.value.add( subElement, at );
	}

	move( from, to ) {
		const subFrom = this.value.get( from );
		this.remove( from );
		this.add( subFrom, to );
	}

	remove( at ) {
		this.value.remove( at );
	}

	duplicate( at ) {
		const subElement = this.value.get( at );
		this.add( subElement, at + 1 );
	}

	update( at, settings ) {
		this.value.get( at ).set( settings );
	}
}
