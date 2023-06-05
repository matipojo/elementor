export function parseSize( value, asObject = false ) {
	let [ , size, unit ] = value.match( /^(-?\d+)(\D*)$/ ) || [];

	if ( ! size ) {
		size = 0;
	}

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

export function parseGradient( bgGradient ) {
	// Define the regular expression patterns to match different types of gradients
	const linearPattern = /linear-gradient\((.+)\)/;
	const radialPattern = /radial-gradient\((.+)\)/;

	// Check if the gradient is linear or radial
	if ( bgGradient.match( linearPattern ) ) {
		const gradientParams = bgGradient.match( linearPattern )[ 1 ].split( ',' );

		// Extract angle and colors
		let angle = null;
		if ( gradientParams[ 0 ].includes( 'deg' ) ) {
			angle = parseSize( gradientParams[ 0 ], true );
		}
		const colors = gradientParams.slice( 1 ).map( ( color ) => color.trim() );

		return {
			type: 'linear',
			angle,
			colors,
		};
	} else if ( bgGradient.match( radialPattern ) ) {
		const gradientParams = bgGradient.match( radialPattern )[ 1 ].split( ',' );

		// Extract colors
		const colors = gradientParams.map( ( color ) => color.trim() );

		return {
			type: 'radial',
			colors,
		};
	}
	// Invalid gradient format
	return null;
}

export function parseFont( font ) {
	const [ family ] = font.split( ',' );

	return family.trim();
}
