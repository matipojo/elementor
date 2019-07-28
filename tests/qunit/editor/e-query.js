jQuery( () => {
	QUnit.module( 'eQuery' );

	// Create a section at end of document.
	$e().create( 'section' ); // Page -> Sections -> Last
	$e().remove(); // Page -> Sections -> All

	$e().moveTo(); // ????

	$e().copy(); // Page -> Sections -> All
	$e().duplicate(); // Page -> Sections -> All
	$e().paste(); // Page -> Sections -> Last

	$e().pasteStyle(); // Page -> Settings
	$e().resetStyle(); // Page -> Settings

	$e().settings(); // Page -> Settings

	$e().save(); // Draft

	/////////////////////////////

	$eSection.create( 'column' ); // Section -> Last
	$eSection.remove();

	$eSection.moveTo( 2 );

	$eSection.copy();
	$eSection.duplicate();
	$eSection.paste();

	$eSection.pasteStyle();
	$eSection.resetStyle();

	$eSection.settings();

	$eSection.save(); // Library

	// Create a section with settings.
	var $eSection;

	$eSection = $e().create( 'section', {
		background_background: 'classic',
		background_color: '#7a7a7a',
	} );

	// Create a section in a specific position.
	$eSection = $e().create( 'section', {}, {
		at: 0,
	} );

	// Select & Move by id. e.g. $e( '#akjxzk' ).moveTo( $e( '#bccdsd' ));
	// buggy! because the $eSection is destroyed during the move.
	$e( '#' + $eSection.context[ 0 ].model.id ).moveTo( $e(), { at: 0 } );

	// Create a section and add a widget.
	$e().create( 'section' ).create( 'column' ).create( [ 'widget', 'heading' ] );

	// Separated actions.
	$eSection = $e().create( 'section' );
	$eColumn2 = $eSection.create( 'column' );
	$eHeading = $eColumn2.create( [ 'widget', 'heading' ], {
		title: 'Hi, I\'m an Heading',
	} );

	// Add a widget at top of the column.
	$eColumn2.create( [ 'widget', 'button' ],
		{
			title: 'Click Me',
		},
		{
			at: 0,
		}
	);

	// Update widget settings.
	$eHeading.settings( {
		title: 'I\'m a Changed title',
	} );

	// Select element by ID.
	$e( '#3fe3306' ).settings( {
		_background_background: 'classic',
		_background_image: {
			url: 'http://localhost/elementor/wp-content/uploads/2019/02/library.jpg',
			id: 22589,
		},
	} );

	let $eColumn3 = $eSection.create( 'column' );

	// Move widget.
	$eHeading.moveTo( $eColumn3 );
	$eHeading.moveTo( $eColumn2, { at: 0 } );

	// Drag from panel.
	let $eVideo = $eColumn3.create( [ 'widget', 'video' ] );

	// Lazy save
	$eHeading
		.settings( {
			title: 'Hi, I\'m a title #1',
		} )
		.settings( {
			title: 'Hi, I\'m a title #2',
		} )
		.settings( {
			title: 'Hi, I\'m a title #3',
		} );

	// Multiple elements & multiple settings.
	$eHeading.add( $eHeading2 )
		.settings( {
			title: 'Hi, I\'m a red title',
			title_color: 'red',
		} )
		.settings( {
			title: 'Hi, I\'m blue title',
			title_color: 'blue',
		} )
		.settings( {
			title: 'Hi, I\'m green title',
			title_color: 'green',
		} );

	let $eTabs = $eColumn3.create( [ 'widget', 'tabs' ] );

	let $tab = $eTabs.get( 'tabs' ).add( {
		title: 'Tab #4',
		content: '<p>Tab #4 content</p>',
	}, 4 );

	$tab.settings( {
		content: '<p>Tab #4 after edit</p>',
	} );

	$eTabs.get( 'tabs' ).find( $tab );

	$eTabs.get( 'tabs' ).remove( $tab );

	/////////////////////////////////////////////////

	// Copy elements.
	$eHeading.add( $eVideo ).copy();

	// Paste.
	$eColumn2.paste();

	// Remove.
	$eVideo.remove();

	//Remove again without errors
	$eVideo.remove();

	// Paste Style.
	$eHeading.copy();

	$eColumn3.find( 'heading' ).pasteStyle();

	$e().settings( {
		_background_background: 'classic',
		_background_image: {
			url: 'http://localhost/elementor/wp-content/uploads/2019/02/library.jpg',
			id: 22589,
		},
	} );

	$e().save();
} );
