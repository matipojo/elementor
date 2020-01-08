// TODO: All components under document can be in one index file.
import DocumentComponent from './document/component';
import SaveComponent from './document/save/component';
import UIComponent from './document/ui/component';
import ElementsComponent from './document/elements/component';
import RepeaterComponent from './document/repeater/component';
import HistoryComponent from './document/history/component';
import DynamicComponent from './document/dynamic/component';

elementorCommon.elements.$window.on( 'elementor:init', () => {
	$e.components.register( new DocumentComponent() );
	$e.components.register( new SaveComponent() );
	$e.components.register( new UIComponent() );
	$e.components.register( new ElementsComponent() );
	$e.components.register( new RepeaterComponent() );
	$e.components.register( new HistoryComponent() );
	$e.components.register( new DynamicComponent() );
} );
