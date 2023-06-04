export function parseSize( value, asObject = false ) {
	let [ , size, unit ] = value.match( /^(\d+)(\D*)$/ );

	if ( ! unit ) {
		unit = 'px';
	}

	if ( asObject ) {
		return { size, unit };
	}

	return [ size, unit ];
}

export function normalize4Sizes( value ) {
	const split = value.split( ' ' );

	if ( 1 === split.length ) {
		const [ size, unit ] = parseSize( split[ 0 ] );

		return {
			top: size,
			right: size,
			bottom: size,
			left: size,
			unit,
			isLinked: true,
		};
	}

	if ( 2 === split.length ) {
		const [ ySize, unit ] = parseSize( split[ 0 ] );
		const [ xSize ] = parseSize( split[ 1 ] );

		return {
			top: ySize,
			bottom: ySize,
			right: xSize,
			left: xSize,
			unit,
			isLinked: false,
		};
	}

	if ( 4 === split.length ) {
		const [ topSize, unit ] = parseSize( split[ 0 ] );
		const [ rightSize ] = parseSize( split[ 1 ] );
		const [ bottomSize ] = parseSize( split[ 2 ] );
		const [ leftSize ] = parseSize( split[ 3 ] );

		return {
			top: topSize,
			bottom: bottomSize,
			right: rightSize,
			left: leftSize,
			unit,
			isLinked: false,
		};
	}

	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		unit: 'px',
		isLinked: true,
	};
}
