import After from 'elementor-api/modules/hooks/data/after';

export class GenerateImageAI extends After {
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
		const elements = this.getAiElements( [ args.model ] );

		console.log( elements );

		elements.forEach( async ( element ) => {
			const prompt = element.__ai.prompt;

			console.log( `loading image for ${ element.id }` );

			const { images: [ { image_url: imageUrl } ] } = await request(
				'ai_get_text_to_image',
				{
					prompt,
					promptSettings: {
						image_type: 'photographic',
						style_preset: '',
						image_strength: 0,
						ratio: '1:1',
					},
				},
				element.id,
			);

			console.log( `image for ${ element.id }: ${ imageUrl }` );

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
		} );

		return true;
	}

	getAiElements( elements ) {
		return elements
			.flatMap( ( element ) => [
				element,
				...( element.elements.length > 0 ? this.getAiElements( element.elements ) : [] ),
			] )
			.filter( ( element ) => element.__ai && 'image' === element.widgetType );
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
