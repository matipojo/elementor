import NewPromptButton from './new-prompt-button';
import { useEffect, useState } from 'react';
import PromptModal from './prompt-modal';
import { useSelector } from '@elementor/store';
import { selectElementsIds } from '../store';
import ExistingPromptButton from './existing-prompt-button';
import { listenTo, openRoute, windowEvent } from '@elementor/editor-v1-adapters';

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
