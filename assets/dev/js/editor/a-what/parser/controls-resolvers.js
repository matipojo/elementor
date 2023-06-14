import { globalizeColor, normalize4Sizes, parseFont, parseGradient, parseSize } from './controls-parsers';

export function common() {
	return {
		...bgColor( 'bgColor', '_background' ),
		...bgColor( 'hover_bgColor', '_background_hover' ),
		width: ( value, settings ) => {
			settings._element_width = 'initial';

			return [ '_element_custom_width', parseSize( value, true ) ];
		},
		padding: ( value ) => {
			return [ '_padding', normalize4Sizes( value ) ];
		},
		margin: ( value ) => {
			return [ '_margin', normalize4Sizes( value ) ];
		},
		...border( 'border', '_border' ),
		...border( 'hover_border', '_border_hover' ),
		borderRadius: ( value ) => {
			return [ '_border_radius', normalize4Sizes( value ) ];
		},
		align: ( value ) => {
			return [ 'align', value ];
		},
		zIndex: ( value ) => {
			value = Math.max( 0, parseInt( value ) );

			return [ '_z_index', value.toString() ];
		},
	};
}

export function border( attrName, prefix ) {
	return {
		[ attrName ]: ( value, settings ) => {
			if ( 'none' === value ) {
				return [ `${ prefix }_width`, normalize4Sizes( '0' ) ];
			}

			const [ size, style, color ] = value.split( ' ' );

			settings[ `${ prefix }_border` ] = style;
			settings[ `${ prefix }_width` ] = normalize4Sizes( size );

			return [ `${ prefix }_color`, color ];
		},
	};
}

export function bgColor( attrName, prefix ) {
	return {
		[ attrName ]: ( value, settings ) => {
			settings[ `${ prefix }_background` ] = 'classic';

			const color = globalizeColor( `${ prefix }_color`, value );

			assignColor( settings, color );

			return [ '__', 'asd' ];
		},
	};
}

function assignColor( settings, color ) {
	if ( Array.isArray( color ) ) {
		settings[ color[ 0 ] ] = color[ 1 ];

		return;
	}

	for ( const [ key, value ] of Object.entries( color ) ) {
		if ( '__globals__' === key ) {
			continue;
		}

		settings[ key ] = value;
	}

	if ( color.__globals__ ) {
		settings.__globals__ = {
			...settings.__globals__,
			...color.__globals__,
		};
	}
}

export function bgGradient( attrName, prefix ) {
	return {
		[ attrName ]: ( value, settings ) => {
			settings[ `${ prefix }_background` ] = 'gradient';

			const { type, angle, colors } = parseGradient( value );

			const color1 = globalizeColor( `${ prefix }_color`, colors[ 0 ] );
			const color2 = globalizeColor( `${ prefix }_color_b`, colors[ 1 ] );

			assignColor( settings, color1 );
			assignColor( settings, color2 );

			settings[ `${ prefix }_gradient_angle` ] = angle;

			return [ `${ prefix }_gradient_type`, type ];
		},
	};
}

export function typography( prefix = 'typography' ) {
	return {
		font: ( value, settings ) => {
			settings[ `${ prefix }_typography` ] = 'custom';

			return [ `${ prefix }_font_family`, parseFont( value ) ];
		},
		fontSize: ( value, settings ) => {
			settings[ `${ prefix }_typography` ] = 'custom';

			return [ `${ prefix }_font_size`, parseSize( value, true ) ];
		},
		fontWeight: ( value, settings ) => {
			settings[ `${ prefix }_typography` ] = 'custom';

			return [ `${ prefix }_font_weight`, value ];
		},
	};
}
