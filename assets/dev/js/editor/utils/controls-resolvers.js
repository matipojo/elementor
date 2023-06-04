import { normalize4Sizes, parseSize } from './controls-parsers';

export function common() {
	return {
		bgColor: ( value, settings ) => {
			settings._background_background = 'classic';

			return [ '_background_color', value ];
		},
		hover_bgColor: ( value, settings ) => {
			settings._background_hover_background = 'classic';

			return [ '_background_hover_color', value ];
		},
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
		border: ( value, settings ) => {
			const [ size, style, color ] = value.split( ' ' );

			settings._border_border = style;
			settings._border_width = normalize4Sizes( size );

			return [ '_border_color', color ];
		},
		borderRadius: ( value ) => {
			return [ '_border_radius', normalize4Sizes( value ) ];
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
