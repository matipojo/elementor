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

		const attrsMap = {
			width: ( value ) => {
				return [ 'boxed_width', this.parseSize( value, true ) ];
			},
			height: ( value ) => {
				return [ 'min_height', this.parseSize( value, true ) ];
			},
			gap: ( value ) => {
				return [ 'flex_gap', this.parseSize( value, true ) ];
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
				settings.border_width = this.normalize4Sizes( size );

				return [ 'border_color', color ];
			},
			borderRadius: ( value ) => {
				return [ 'border_radius', this.normalize4Sizes( value ) ];
			},
			padding: ( value ) => {
				return [ 'padding', this.normalize4Sizes( value ) ];
			},
			margin: ( value ) => {
				return [ 'margin', this.normalize4Sizes( value ) ];
			},
			bgColor: ( value, settings ) => {
				settings.background_background = 'classic';

				return [ 'background_color', value ];
			},
			hover_bgColor: ( value, settings ) => {
				settings.background_hover_background = 'classic';

				return [ 'background_hover_color', value ];
			},
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
			...this.common(),
			...this.typography(),
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

	parseSize( value, asObject = false ) {
		let [ , size, unit ] = value.match( /^(\d+)(\D*)$/ );

		if ( ! unit ) {
			unit = 'px';
		}

		if ( asObject ) {
			return { size, unit };
		}

		return [ size, unit ];
	}

	normalize4Sizes( value ) {
		const split = value.split( ' ' );

		if ( 1 === split.length ) {
			const [ size, unit ] = this.parseSize( split[ 0 ] );

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
			const [ ySize, unit ] = this.parseSize( split[ 0 ] );
			const [ xSize ] = this.parseSize( split[ 1 ] );

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
			const [ topSize, unit ] = this.parseSize( split[ 0 ] );
			const [ rightSize ] = this.parseSize( split[ 1 ] );
			const [ bottomSize ] = this.parseSize( split[ 2 ] );
			const [ leftSize ] = this.parseSize( split[ 3 ] );

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

	common() {
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

				return [ '_element_custom_width', this.parseSize( value, true ) ];
			},
			padding: ( value ) => {
				return [ '_padding', this.normalize4Sizes( value ) ];
			},
			margin: ( value ) => {
				return [ '_margin', this.normalize4Sizes( value ) ];
			},
			border: ( value, settings ) => {
				const [ size, style, color ] = value.split( ' ' );

				settings._border_border = style;
				settings._border_width = this.normalize4Sizes( size );

				return [ '_border_color', color ];
			},
			borderRadius: ( value ) => {
				return [ '_border_radius', this.normalize4Sizes( value ) ];
			},
		};
	}

	typography( prefix = 'typography' ) {
		return {
			font: ( value, settings ) => {
				settings[ `${ prefix }_typography` ] = 'custom';

				return [ `${ prefix }_font_family`, value ];
			},
			fontSize: ( value, settings ) => {
				settings[ `${ prefix }_typography` ] = 'custom';

				return [ `${ prefix }_font_size`, this.parseSize( value, true ) ];
			},
			fontWeight: ( value, settings ) => {
				settings[ `${ prefix }_typography` ] = 'custom';

				return [ `${ prefix }_font_weight`, value ];
			},
		};
	}
}
