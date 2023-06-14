export class GenerateImageAI extends $e.modules.hookData.After {
	getCommand() {
		return 'document/elements/create';
	}

	getId() {
		return 'generate-image-ai--document/elements/create';
	}

	getConditions( args ) {
		return true;
	}

	apply( args ) {
		window.prompt_image_map = window.prompt_image_map || {};

		const elements = this.getAiElements( [ args.model ] );

		elements.forEach( async ( element ) => {
			this.toggleLoader( element.id, true );

			const prompt = element.__ai.prompt;
			window.prompt_image_map[ element.id ] = window.prompt_image_map[ element.id ] || {};

			const isBg = 'container' === element.elType;
			const key = prompt + isBg ? '__bg' : '__normal';

			let imageUrl;

			if ( window.prompt_image_map[ element.id ][ key ] ) {
				imageUrl = window.prompt_image_map[ element.id ][ key ];
			} else {
				const { images: [ { image_url } ] } = await request(
					'ai_get_text_to_image',
					{
						prompt,
						promptSettings: {
							image_type: ! isBg ? 'photographic' : 'background',
							style_preset: '',
							image_strength: 0,
							ratio: ! isBg ? '3:4' : '16:9',
						},
					},
					element.id,
				);

				imageUrl = image_url;
				window.prompt_image_map[ element.id ][ key ] = image_url;
			}

			if ( isBg ) {
				$e.run( 'document/elements/settings', {
					container: elementor.getContainer( element.id ),
					settings: {
						background_background: 'classic',
						background_image: {
							id: '',
							url: imageUrl,
						},
						background_position: 'center center',
						background_repeat: 'no-repeat',
						background_size: 'cover',
						background_overlay_background: 'classic',
						background_overlay_color: '#000000',
						background_attachment: 'fixed',
						background_overlay_opacity: {
							unit: 'px',
							size: 0.3,
							sizes: [],
						},
					},
					options: {
						external: true,
					},
				} );
			} else {
				$e.run( 'document/elements/settings', {
					container: elementor.getContainer( element.id ),
					settings: {
						image: {
							url: imageUrl,
							id: '',
						},
					},
					options: {
						external: true,
					},
				} );
			}

			this.toggleLoader( element.id, true );
		} );

		return true;
	}

	getAiElements( elements ) {
		return elements
			.flatMap( ( element ) => [
				element,
				...( element.elements?.length > 0 ? this.getAiElements( element.elements ) : [] ),
			] )
			.filter( ( element ) => element.__ai && ( 'image' === element.widgetType || 'container' === element.elType ) );
	}

	toggleLoader( id, loading ) {
		const element = elementor.getContainer( id )?.view?.$el?.[ 0 ];

		if ( ! element ) {
			return;
		}

		if ( loading ) {
			element.classList.add( 'ai-loading' );
		} else {
			element.classList.remove( 'ai-loading' );
		}
	}
}

function request( endpoint, data = {}, id ) {
	return new Promise( ( resolve, reject ) => elementorCommon.ajax.addRequest(
		endpoint,
		{
			success: resolve,
			error: reject,
			data,
		},
		true,
	) );
}

export default GenerateImageAI;
