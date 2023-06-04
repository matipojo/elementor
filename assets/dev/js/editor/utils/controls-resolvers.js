import { normalize4Sizes, parseSize } from './controls-parsers';

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
	};
}

export function border( attrName, prefix ) {
	return {
		[ attrName ]: ( value, settings ) => {
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

			return [ `${ prefix }_color`, value ];
		},
	};
}

export function typography( prefix = 'typography' ) {
	return {
		font: ( value, settings ) => {
			settings[ `${ prefix }_typography` ] = 'custom';

			return [ `${ prefix }_font_family`, value ];
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
