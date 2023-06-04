import { bgColor, border, common, typography } from './controls-resolvers';
import { normalize4Sizes, parseSize } from './controls-parsers';

export class HTML4Parser {
	parse( xml ) {
		const parser = new DOMParser();
		const doc = parser.parseFromString( xml, 'application/xml' );

		const node = doc.firstElementChild;

		return {
			content: [
				this.parseNode( node ),
			],
		};
	}

	import( xml ) {
		const data = this.parse( xml );
		const model = new Backbone.Model( {
			title: 'HTML4',
		} );

		return $e.run( 'document/elements/import', {
			data,
			model,
		} );
	}

	/**
	 * @param {Element} node
	 */
	parseNode( node ) {
		let result = {};

		// Add text content as attribute.
		const text = [ ...node.childNodes ]
			.filter( ( n ) => n.nodeType === Node.TEXT_NODE )
			.map( ( n ) => n.textContent )
			.join( ' ' );

		node.setAttribute( '__text', text );

		switch ( node.tagName ) {
			case 'row':
			case 'column':
				result = this.parseContainer( node );
				break;

			case 'title':
				result = this.parseHeading( node );
				break;

			case 'text':
				result = this.parseText( node );
				break;

			case 'button':
				result = this.parseButton( node );
				break;

			default:
				break;
		}

		result.elements = [ ...node.children ].map( ( child ) => {
			return this.parseNode( child );
		} );

		result.id = elementorCommon.helpers.getUniqueId();

		return result;
	}

	/**
	 *
	 * @param {Element} node
	 */
	parseContainer( node ) {
		const result = {
			elType: 'container',
			settings: {
				flex_direction: node.tagName,
			},
		};

		// Color,
		// bgColor,
		// bgImage,
		// bgGradient,
		// height,
		// width,
		// padding,
		// margin,
		// gap,
		// alignItems,
		// border,
		// borderRadius,
		// font,
		// fontSize,
		// fontWeight
		// align

		const attrsMap = {
			width: ( value ) => {
				return [ 'boxed_width', parseSize( value, true ) ];
			},
			height: ( value ) => {
				return [ 'min_height', parseSize( value, true ) ];
			},
			gap: ( value ) => {
				return [ 'flex_gap', parseSize( value, true ) ];
			},
			alignItems: ( value ) => {
				// Normalize start/end.
				if ( [ 'start', 'end' ].includes( value ) ) {
					value = `flex-${ value }`;
				}

				return [ 'flex_align_items', value ];
			},
			border: ( value, settings ) => {
				const [ size, style, color ] = value.split( ' ' );

				// TODO: By reference???
				settings.border_border = style;
				settings.border_width = normalize4Sizes( size );

				return [ 'border_color', color ];
			},
			borderRadius: ( value ) => {
				return [ 'border_radius', normalize4Sizes( value ) ];
			},
			padding: ( value ) => {
				return [ 'padding', normalize4Sizes( value ) ];
			},
			margin: ( value ) => {
				return [ 'margin', normalize4Sizes( value ) ];
			},
			...bgColor( 'bgColor', 'background' ),
			...bgColor( 'hover_bgColor', 'background_hover' ),
		};

		result.settings = {
			...result.settings,
			...this.parseAttributes( node, attrsMap ),
		};

		return result;
	}

	parseHeading( node ) {
		const result = {
			elType: 'widget',
			widgetType: 'heading',
		};

		const attrsMap = {
			...common(),
			...typography(),
			__text: ( value ) => {
				return [ 'title', value ];
			},
			color: ( value ) => {
				return [ 'title_color', value ];
			},
		};

		result.settings = this.parseAttributes( node, attrsMap );

		return result;
	}

	parseText( node ) {
		const result = {
			elType: 'widget',
			widgetType: 'text-editor',
		};

		const attrsMap = {
			...common(),
			...typography(),
			__text: ( value ) => {
				return [ 'editor', value ];
			},
			color: ( value ) => {
				return [ 'text_color', value ];
			},
		};

		result.settings = this.parseAttributes( node, attrsMap );

		return result;
	}

	parseButton( node ) {
		const result = {
			elType: 'widget',
			widgetType: 'button',
		};

		const attrsMap = {
			...common(),
			...typography(),
			__text: ( value ) => {
				return [ 'text', value ];
			},
			color: ( value ) => {
				return [ 'button_text_color', value ];
			},
			// Override things from common.
			...border( 'border', 'border' ),
			...border( 'hover_border', 'button_hover_border' ),
			...bgColor( 'bgColor', 'background' ),
			...bgColor( 'hover_bgColor', 'button_background_hover' ),
		};

		result.settings = this.parseAttributes( node, attrsMap );

		return result;
	}

	parseAttributes( node, attrsMap ) {
		const settings = {};

		Object.entries( attrsMap ).forEach( ( [ attr, resolver ] ) => {
			const attrValue = node.getAttribute( attr );

			if ( ! attrValue ) {
				return;
			}

			const [ control, settingValue ] = resolver( attrValue, settings );

			settings[ control ] = settingValue;
		} );

		return settings;
	}
}
