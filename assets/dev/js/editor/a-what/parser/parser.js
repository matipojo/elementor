import { bgColor, bgGradient, border, common, typography } from './controls-resolvers';
import { normalize4Sizes, parseSize } from './controls-parsers';

export class Parser {
	parse( xml, elementId = null ) {
		const parser = new DOMParser();
		const doc = parser.parseFromString( xml, 'text/html' );

		const node = doc.body.firstElementChild;

		return {
			content: [
				this.parseNode( node, elementId ),
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
	 * @param {string}  id
	 */
	parseNode( node, id = null ) {
		let result = {};

		// Add text content as attribute.
		const text = [ ...node.childNodes ]
			.filter( ( n ) => n.nodeType === Node.TEXT_NODE )
			.map( ( n ) => n.textContent )
			.join( ' ' )
			.trim();

		node.setAttribute( '__text', text );

		switch ( node.tagName.toLocaleLowerCase() ) {
			case 'row':
			case 'column':
				result = this.parseContainer( node );
				break;

			case 'form':
				result = this.parseForm( node );
				break;

			case 'title':
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'h6':
				result = this.parseHeading( node );
				break;

			case 'text':
				result = this.parseText( node );
				break;

			case 'button':
				result = this.parseButton( node );
				break;

			case 'divider':
				result = this.parseDivider( node );
				break;

			case 'icon':
				result = this.parseIcon( node );
				break;

			case 'image':
			case 'img':
				result = this.parseImage( node );
				break;

			default:
				break;
		}

		result.elements = result.elements || [];
		result.id = id || elementorCommon.helpers.getUniqueId();

		return result;
	}

	/**
	 *
	 * @param {Element} node
	 */
	parseContainer( node ) {
		const isRootNode = ! node.parentElement;

		const result = {
			elType: 'container',
			settings: {
				flex_direction: node.tagName.toLocaleLowerCase(),
				content_width: isRootNode ? 'boxed' : 'full',
			},
			__ai: {
				prompt: node.getAttribute( 'bgImageAlt' ) || node.getAttribute( 'bg-image' ) || node.getAttribute( 'bgImage' ),
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
			justifyContent: ( value ) => {
				// Normalize start/end.
				if ( [ 'start', 'end' ].includes( value ) ) {
					value = `flex-${ value }`;
				}

				return [ 'flex_justify_content', value ];
			},
			wrap: () => {
				return [ 'flex_wrap', 'wrap' ];
			},
			fullWidth: () => {
				return [ 'content_width', 'full' ];
			},
			boxed: () => {
				return [ 'content_width', 'boxed' ];
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
			...bgGradient( 'bgGradient', 'background' ),
			...bgGradient( 'hover_bgGradient', 'background_hover' ),
			...bgColor( 'bgColor', 'background' ),
			...bgColor( 'hover_bgColor', 'background_hover' ),
		};

		result.settings = {
			...result.settings,
			...this.parseAttributes( node, attrsMap ),
		};

		result.elements = [ ...node.children ].map( ( child ) => {
			return this.parseNode( child );
		} ).filter( ( el ) => !! el.elType );

		return result;
	}

	parseForm( node ) {
		const result = {
			elType: 'widget',
			widgetType: 'form',
			settings: {},
		};

		const attrsMap = {
			...common(),
		};

		result.settings = {
			...result.settings,
			...this.parseAttributes( node, attrsMap ),
		};

		const inputs = [ ...node.querySelectorAll( 'input:not( [type="button"] ):not( [type="submit"] )' ) ];
		result.settings.form_fields = inputs.map( ( input ) => this.parseFormTextInput( input ) );

		const fieldsSettings = this.parseFormFields( inputs );

		const button = node.querySelector( 'input[type="button"], input[type="submit"], button' );
		const buttonSettings = this.parseFormButton( button );

		result.settings = {
			...result.settings,
			...buttonSettings,
			...fieldsSettings,
		};

		return result;
	}

	parseFormTextInput( node ) {
		const allowedWidths = [ 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 100 ];

		const getClosestWidth = ( width ) => {
			return allowedWidths.reduce( ( prev, curr ) => {
				return ( Math.abs( curr - width ) < Math.abs( prev - width ) ? curr : prev );
			} ).toString();
		};

		const getLabel = ( input ) => {
			const id = input.getAttribute( 'id' );
			const label = input.closest( 'form' ).querySelector( `label[for="${ id }"]` );

			return label?.textContent || '';
		};

		return {
			_id: elementorCommon.helpers.getUniqueId(),
			field_label: getLabel( node ),
			field_type: node.getAttribute( 'type' ) || 'text',
			placeholder: node.getAttribute( 'placeholder' ) || '',
			width: getClosestWidth( parseInt( node.getAttribute( 'width' ) ) || '100' ),
		};
	}

	parseFormButton( node ) {
		if ( ! node ) {
			return {};
		}

		const allowedWidths = [ 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 100 ];

		const getClosestWidth = ( width ) => {
			return allowedWidths.reduce( ( prev, curr ) => {
				return ( Math.abs( curr - width ) < Math.abs( prev - width ) ? curr : prev );
			} ).toString();
		};

		const attrsMap = {
			...typography( 'button_typography' ),
			...border( 'border', 'button_border' ),
			bgColor: ( value ) => {
				return [ 'button_background_color', value ];
			},
			color: ( value ) => {
				return [ 'button_text_color', value ];
			},
			borderRadius: ( value ) => {
				return [ 'button_border_radius', normalize4Sizes( value ) ];
			},
			padding: ( value ) => {
				return [ 'button_text_padding', normalize4Sizes( value ) ];
			},
			hover_bgColor: ( value ) => {
				return [ 'button_background_hover_color', value ];
			},
			hover_color: ( value ) => {
				return [ 'button_hover_color', value ];
			},
		};

		return {
			button_width: getClosestWidth( parseInt( node.getAttribute( 'width' ) ) || '100' ),
			button_align: node.getAttribute( 'align' ) || '',
			button_text: node.textContent || node.getAttribute( 'value' ) || '',
			...this.parseAttributes( node, attrsMap ),
		};
	}

	parseFormFields( inputs ) {
		const result = {};

		const attrsMap = {
			...typography( 'field_typography' ),
			...border( 'border', 'field_border' ),
			bgColor: ( value ) => {
				return [ 'field_background_color', value ];
			},
			color: ( value ) => {
				return [ 'field_text_color', value ];
			},
			borderRadius: ( value ) => {
				return [ 'field_border_radius', normalize4Sizes( value ) ];
			},
			padding: ( value ) => {
				return [ 'field_text_padding', normalize4Sizes( value ) ];
			},
		};

		inputs.forEach( ( input ) => {
			Object.assign( result, this.parseAttributes( input, attrsMap ) );
		} );

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

	parseImage( node ) {
		const result = {
			elType: 'widget',
			widgetType: 'image',
			__ai: {
				prompt: node.getAttribute( 'alt' ) || node.getAttribute( 'bgImage' ) || node.getAttribute( 'src' ) || node.getAttribute( '__text' ),
			},
		};

		const attrsMap = {
			...common(),
			// Override things from common.
			...border( 'border', 'image_border' ),
			borderRadius: ( value ) => {
				return [ 'image_border_radius', normalize4Sizes( value ) ];
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
			href: ( value ) => {
				return [ 'link', { url: value } ];
			},
			hover_color: ( value ) => {
				return [ 'hover_color', value ];
			},
			// Override things from common.
			...border( 'border', 'border' ),
			...border( 'hover_border', 'button_hover_border' ),
			...bgColor( 'bgColor', 'background' ),
			...bgColor( 'hover_bgColor', 'button_background_hover' ),
			padding: ( value ) => {
				return [ 'text_padding', normalize4Sizes( value ) ];
			},
		};

		result.settings = this.parseAttributes( node, attrsMap );

		return result;
	}

	parseIcon( node ) {
		const result = {
			elType: 'widget',
			widgetType: 'icon',
		};

		const attrsMap = {
			...common(),
			color: ( value ) => {
				return [ 'primary_color', value ];
			},
			fontSize: ( value ) => {
				return [ 'size', parseSize( value, true ) ];
			},
			selected_icon: ( value ) => {
				return [ 'selected_icon', { value, library: 'fa-solid' } ];
			},
		};

		result.settings = this.parseAttributes( node, attrsMap );
		return result;
	}

	parseDivider( node ) {
		const result = {
			elType: 'widget',
			widgetType: 'divider',
		};

		const attrsMap = {
			...common(),
			color: ( value ) => {
				return [ 'color', value ];
			},
			// Override things from common.
			width: ( value ) => {
				return [ 'width', parseSize( value, true ) ];
			},
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
