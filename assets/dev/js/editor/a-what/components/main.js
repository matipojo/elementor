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
				[ heroContainer.id ]: '<row><text>Hack result for hero</text></row>',
				[ aboutContainer.id ]: '<row><text>Hack result for about</text></row>',
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
