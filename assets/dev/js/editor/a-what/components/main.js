import NewPromptButton from './new-prompt-button';
import { useEffect, useState } from 'react';
import PromptModal from './prompt-modal';
import { dispatch, useSelector } from '@elementor/store';
import { selectElementsIds, slice } from '../store';
import ExistingPromptButton from './existing-prompt-button';
import { listenTo, openRoute, v1ReadyEvent, windowEvent } from '@elementor/editor-v1-adapters';

listenTo(
	v1ReadyEvent(),
	() => {
		setTimeout( () => {
			const cache = JSON.parse( localStorage.getItem( 'cache' ) || '{}' );

			if ( ! cache.hero || ! cache.about ) {
				return;
			}

			const { content: [ heroModel ] } = window.elementor.html4Parser.parse(
				cache.hero.xml,
			);

			delete heroModel.__ai;

			const heroContainer = $e.run( 'document/elements/create', {
				container: elementor.getPreviewContainer(),
				model: heroModel,
				options: { edit: false },
			} );

			const { content: [ aboutModel ] } = window.elementor.html4Parser.parse(
				cache.about.xml,
			);

			delete aboutModel.__ai;

			const aboutContainer = $e.run( 'document/elements/create', {
				container: elementor.getPreviewContainer(),
				model: aboutModel,
				options: { edit: false },
			} );

			window.onboarding_elements_hacks = {
				[ aboutContainer.id ]: `<row boxed="true" width="1400px" height="80vh" bgGradient="linear-gradient(40deg, var( --primary-color ) 10%, var( --primary-darker-color ) 30%)" padding="5%">
					<column fullWidth="true" width="100%" justifyContent="center" gap="30px" padding="0">
						<divider width="105px" color="var( --divider-color )"></divider>
						<title color="var( --primary-color )" font="Poppins" fontWeight="500" fontSize="60px">Welcome to Varda's Flower Shop</title>
						<text color="var( --text-color )" font="Poppins" fontWeight="300" fontSize="20px">
							We provide beautiful, fresh and high-quality flowers and bouquets for every occasion, from weddings and birthdays to funerals and corporate events. Our team of expert florists handpick and arrange each stem with great care and attention to detail, ensuring that every creation is unique and stunning. Come visit Varda's and let us help you express your feelings with flowers.
						</text>
					</column>
					<row fullWidth="true" width="100%" justifyContent="end" gap="20px" padding="0" wrap="true">
						<img width="40%" alt="studio instagram style of roses flowers" />
						<img width="40%" alt="studio instagram style of orchid flowers" />
						<img width="40%" alt="studio instagram style of lily flowers" />
						<img width="40%" alt="studio instagram style of tulip flowers" />
					</row>
				</row>`,
				[ heroContainer.id ]: `<column fullWidth="true" height="100vh" alignItems="center" justifyContent="center" bgColor="#F7F7F7">
					<row fullWidth="true" justifyContent="center" alignItems="center">
						<img alt="Flower" borderRadius="50%" width="600px" height="600px" border="30px solid #fff" boxShadow="0 0 30px rgba(0, 0, 0, 0.2)" zIndex="1" position="relative" top="-300px" left="50%" margin="0 0 0 -300px" />
						<column width="800px"padding="40px" borderRadius="20px" boxShadow="0 0 30px rgba(0, 0, 0, 0.2)" zIndex="2">
							<title font="Poppins" fontWeight="800" fontSize="48px" color="#333" align="center" margin="0 0 30px 0">
								Beautiful flowers
								<br/> delivered to you
							</title>
							<text font="Poppins" fontWeight="400" fontSize="24px" color="#666" align="center">Welcome to our flower shop, where we take pride in offering the best and freshest flowers for any occasion. We make sure every bouquet and arrangement is crafted with care and attention to detail, so you can give the gift of beauty and joy with confidence. </text>
							<button align="center" bgColor="rgb(193 119 221)" color="#fff" font="Poppins" fontWeight="600" fontSize="24px" padding="20px 40px" borderRadius="10px" marginTop="30px">Shop Now</button>
						</column>
					</row>
				</column>`,
			};

			dispatch( slice.actions.start( { elementId: heroContainer.id, prompt: cache.hero.prompt } ) );
			dispatch( slice.actions.end( { elementId: heroContainer.id, result: cache.hero.xml } ) );

			dispatch( slice.actions.start( { elementId: aboutContainer.id, prompt: cache.about.prompt } ) );
			dispatch( slice.actions.end( { elementId: aboutContainer.id, result: cache.about.xml } ) );

			localStorage.removeItem( 'cache' );
		}, 4000 );
	},
);

export default function Main() {
	const [ elementId, setElementId ] = useState( null );
	const elementsIds = useSelector( selectElementsIds );

	useEffect( () => {
		return listenTo( windowEvent( 'elementor/prompt/open' ), ( e ) => {
			openRoute( 'panel/no-panel' );
			setElementId( e.originalEvent.detail.id );
		} );
	}, [] );

	useEffect( () => {
		if ( ! elementId ) {
			return;
		}

		const frameDocument = document.getElementById( 'elementor-preview-iframe' ).contentWindow.document;
		const styleEl = frameDocument.createElement( 'style' );
		const css = `.elementor-element-${ elementId } { border: 2px solid #EB8EFB }`;

		styleEl.appendChild( frameDocument.createTextNode( css ) );

		frameDocument.head.appendChild( styleEl );

		return () => {
			styleEl.remove();
		};
	}, [ elementId ] );

	return <>
		<PromptModal elementId={ elementId } setElementId={ setElementId } />
		<NewPromptButton
			onClick={ ( e ) => {
				e.preventDefault();

				openRoute( 'panel/no-panel' );
				setElementId( elementorCommon.helpers.getUniqueId() );
			} }
		/>
		{ elementsIds.map( ( eId ) => <ExistingPromptButton
			key={ eId }
			elementId={ eId }
		/> ) }
	</>;
}
