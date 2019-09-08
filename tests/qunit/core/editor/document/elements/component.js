import Elements from '../helpers/elements';

jQuery( () => {
	QUnit.module( 'Component: document/elements', () => {
		QUnit.module( 'Single Selection', () => {
			QUnit.test( 'Empty', ( assert ) => {
				const eColumn = Elements.createSection( 1, true );

				Elements.createButton( eColumn );
				Elements.createButton( eColumn );

				// Ensure editor saver.
				elementor.saver.setFlagEditorChange( false );

				Elements.empty();

				// Check.
				assert.equal( elementor.getPreviewContainer().view.collection.length, 0,
					'all elements were removed.' );
				assert.equal( elementor.saver.isEditorChanged(), true, 'Command applied the saver editor is changed.' );
			} );

			QUnit.test( 'Copy All', ( assert ) => {
				const eSection = Elements.createSection( 1 ),
					eColumn = Elements.createColumn( eSection ),
					eButtonsCount = 2;

				for ( let i = 0; i < eButtonsCount; ++i ) {
					Elements.createButton( eColumn );
				}

				Elements.copyAll();

				Elements.paste( elementor.getPreviewContainer(), true );

				assert.equal( eSection.view.collection.length, eButtonsCount,
					`'${ eButtonsCount }' buttons were created.` );
			} );

			QUnit.test( 'Create Section', ( assert ) => {
				const eSection = Elements.createSection( 1 ),
					isSectionCreated = Boolean( elementor.getPreviewContainer().view.children.findByModel( eSection.model ) );

				// Check.
				assert.equal( isSectionCreated, true, 'Section were created.' );
				assert.equal( elementor.saver.isEditorChanged(), true, 'Command applied the saver editor is changed.' );
			} );

			QUnit.test( 'Create Column', ( assert ) => {
				const eColumn = Elements.createSection( 1, true ),
					isColumnCreated = elementor.getPreviewContainer().view.children.some( ( a ) => {
						return a.children.findByModel( eColumn.model );
					} );

				// Check column exist.
				assert.equal( isColumnCreated, true, 'Column were created.' );
				assert.equal( elementor.saver.isEditorChanged(), true, 'Command applied the saver editor is changed.' );
			} );

			QUnit.test( 'Resize Column', ( assert ) => {
				const newSize = 20,
					eSection = Elements.createSection( 2 ),
					eColumn1 = eSection.view.children.findByIndex( 0 ).getContainer(),
					eColumn2 = eSection.view.children.findByIndex( 1 ).getContainer();

				Elements.resizeColumn( eColumn1, newSize );

				// Check values.
				assert.equal( eColumn1.settings.attributes._inline_size, newSize, `Column1 size was changed to '${ newSize }'.` );
				// assert.equal( eColumn2.settings.attributes._inline_size.toFixed( 0 ), '80' ); TODO: Does not work in tests.
			} );

			QUnit.test( 'Create Widget', ( assert ) => {
				const eColumn = Elements.createSection( 1, true ),
					eButton = Elements.createButton( eColumn ),
					isButtonCreated = Boolean( eColumn.view.children.findByModel( eButton.model ) );

				// Check button exist.
				assert.equal( isButtonCreated, true, 'Button were created.' );
			} );

			QUnit.test( 'Create Widget: Inner Section', ( assert ) => {
				const eSection = Elements.createSection( 1 ),
					{ defaultInnerSectionColumns } = eSection.view,
					eColumn = eSection.view.children.findByIndex( 0 ).getContainer(),
					eInnerSection = Elements.createInnerSection( eColumn ),
					isInnerSectionCreated = Boolean( eColumn.view.children.findByModel( eInnerSection.model ) );

				assert.equal( isInnerSectionCreated, true, 'inner section were created.' );
				assert.equal( eInnerSection.view.collection.length, defaultInnerSectionColumns,
					`'${ defaultInnerSectionColumns }' columns were created in the inner section.` );
			} );

			QUnit.test( 'Duplicate', ( assert ) => {
				const eColumn = Elements.createSection( 1, true ),
					eButton = Elements.createButton( eColumn ),
					eButtonDuplicateCount = 2;

				for ( let i = 0; i < eButtonDuplicateCount; ++i ) {
					const eDuplicatedButton = Elements.duplicate( eButton );

					// Check if duplicated buttons have unique ids.
					assert.notEqual( eDuplicatedButton.id, eButton.id, `Duplicate button # ${ i + 1 } have unique id.` );
				}

				// Check duplicated button exist.
				assert.equal( eColumn.view.children.length, ( eButtonDuplicateCount + 1 ),
					`'${ eButtonDuplicateCount }' buttons were duplicated.` );
			} );

			QUnit.test( 'Copy & Paste', ( assert ) => {
				const eColumn = Elements.createSection( 1, true ),
					eButton = Elements.createButton( eColumn );

				Elements.copy( eButton );

				// Ensure editor saver.
				elementor.saver.setFlagEditorChange( false );

				Elements.paste( eColumn );

				// Check.
				assert.equal( eColumn.view.children.length, 2, 'Pasted element were created.' );
				assert.equal( elementor.saver.isEditorChanged(), true, 'Command applied the saver editor is changed.' );
			} );

			QUnit.test( 'Settings', ( assert ) => {
				const eButton = Elements.createMockButtonWidget(),
					text = 'i test it';

				// Change button text.
				Elements.settings( eButton, { text } );

				// Check button text.
				assert.equal( eButton.settings.attributes.text, text, `text setting were changed to: '${ text }'.` );
			} );

			QUnit.test( 'Paste Style', ( assert ) => {
				const eButtonSimple = Elements.createMockButtonWidget(),
					eButtonStyled = Elements.createMockButtonStyled(),
					eStyledButtonBackground = eButtonStyled.settings.attributes.background_color;

				Elements.copy( eButtonStyled );

				// Ensure editor saver.
				elementor.saver.setFlagEditorChange( false );

				Elements.pasteStyle( eButtonSimple );

				// Check
				assert.equal( eButtonSimple.settings.attributes.background_color, eStyledButtonBackground,
					`Button background color was changed to '${ eStyledButtonBackground }'.` );
				assert.equal( elementor.saver.isEditorChanged(), true, 'Command applied the saver editor is changed.' );
			} );

			QUnit.test( 'Reset Style', ( assert ) => {
				const eButtonStyled = Elements.createMockButtonStyled();

				// Ensure editor saver.
				elementor.saver.setFlagEditorChange( false );

				Elements.resetStyle( eButtonStyled );

				// Check pasted style exist.
				assert.equal( eButtonStyled.settings.attributes.background_color, '',
					'Button with custom style were (style) restored.' );
				assert.equal( elementor.saver.isEditorChanged(), true, 'Command applied the saver editor is changed.' );
			} );

			QUnit.test( 'Move Section', ( assert ) => {
				// Create Section at 0.
				Elements.createSection();

				const eSection = Elements.createSection( 3 );

				Elements.move( eSection, elementor.getPreviewContainer(), { at: 0 } );

				// Validate first section have 3 columns.
				assert.equal( elementor.getPreviewContainer().model.attributes.elements.first().attributes.elements.length, 3,
					'Section were moved.' );
			} );

			QUnit.test( 'Move Column', ( assert ) => {
				const eSection1 = Elements.createSection(),
					eSection2 = Elements.createSection(),
					eColumn = Elements.createColumn( eSection1 );

				Elements.move( eColumn, eSection2 );

				// Validate.
				assert.equal( eSection2.view.collection.length, 2,
					'Columns were moved.' );
			} );

			QUnit.test( 'Move Widget', ( assert ) => {
				const eSection = Elements.createSection(),
					eColumn1 = Elements.createColumn( eSection ),
					eColumn2 = Elements.createColumn( eSection ),
					eButton = Elements.createButton( eColumn1 );

				Elements.move( eButton, eColumn2 );

				// Validate.
				assert.equal( eColumn1.view.collection.length, 0, 'Widget were removed from first column.' );
				assert.equal( eColumn2.view.collection.length, 1, 'Widget were moved/created at the second column.' );
			} );

			QUnit.test( 'Delete', ( assert ) => {
				const eColumn = Elements.createSection( 1, true ),
					eButton1 = Elements.createButton( eColumn ),
					eButton2 = Elements.createButton( eColumn );

				Elements.delete( eButton1 );

				// Validate.
				assert.equal( eColumn.view.collection.length, 1, 'Button #1 were deleted.' );

				// Ensure editor saver.
				elementor.saver.setFlagEditorChange( false );

				Elements.delete( eButton2 );

				// Validate.
				assert.equal( eColumn.view.collection.length, 0, 'Button #2 were deleted.' );

				assert.equal( elementor.saver.isEditorChanged(), true, 'Command applied the saver editor is changed.' );
			} );
		} );

		QUnit.module( 'Multiple Selection', () => {
			QUnit.test( 'Create Columns', ( assert ) => {
				const eSection1 = Elements.createSection(),
					eSection2 = Elements.createSection(),
					eColumns = Elements.multiCreateColumn( [ eSection1, eSection2 ] );

				// Check columns exist.
				let count = 1;
				eColumns.forEach( ( eColumn ) => {
					const isColumnCreated = elementor.getPreviewContainer().view.children.some( ( a ) => {
						return a.children.findByModel( eColumn.model );
					} );

					assert.equal( isColumnCreated, true, `Column #${ count } were created.` );
					++count;
				} );
			} );

			QUnit.test( 'Create Widgets', ( assert ) => {
				const eColumn1 = Elements.createSection( 1, true ),
					eColumn2 = Elements.createSection( 1, true ),
					eButtons = Elements.multiCreateButton( [ eColumn1, eColumn2 ] ),
					isButton1Created = Boolean( eColumn1.view.children.findByModel( eButtons[ 0 ].model ) ),
					isButton2Created = Boolean( eColumn2.view.children.findByModel( eButtons[ 1 ].model ) );

				// Check button exist.
				assert.equal( isButton1Created, true, 'Button #1 were created.' );
				assert.equal( isButton2Created, true, 'Button #2 were created.' );
			} );

			QUnit.test( 'Duplicate', ( assert ) => {
				const eColumn1 = Elements.createSection( 1, true ),
					eColumn2 = Elements.createSection( 1, true ),
					eButtons = Elements.multiCreateButton( [ eColumn1, eColumn2 ] );

				Elements.multiDuplicate( eButtons );

				// Check duplicated button exist.
				assert.equal( eColumn1.view.children.length, 2, 'Two buttons were created.' );
				assert.equal( eColumn2.view.children.length, 2, 'Two buttons were duplicated.' );
			} );

			QUnit.test( 'Settings', ( assert ) => {
				const eSection1 = Elements.createSection(),
					eSection2 = Elements.createSection(),
					eColumns = Elements.multiCreateColumn( [ eSection1, eSection2 ] ),
					eButtons = Elements.multiCreateButton( eColumns ),
					text = 'i test it';

				Elements.multiSettings( eButtons, { text } );

				// Check button text.
				let count = 1;
				eButtons.forEach( ( eButton ) => {
					assert.equal( eButton.model.attributes.settings.attributes.text, text,
						`Button #${ count } text was changed to: '${ text }.'` );
					++count;
				} );
			} );

			QUnit.test( 'Copy & Paste', ( assert ) => {
				const eSection1 = Elements.createSection(),
					eSection2 = Elements.createSection(),
					eColumns = Elements.multiCreateColumn( [ eSection1, eSection2 ] ),
					eButtons = Elements.multiCreateButton( eColumns );

				Elements.copy( eButtons[ 0 ] );

				Elements.multiPaste( eColumns );

				// Check pasted button exist.
				let count = 1;
				eColumns.forEach( ( eColumn ) => {
					assert.equal( eColumn.view.children.length, 2,
						`Button #${ count } were pasted.` );
					++count;
				} );
			} );

			QUnit.test( 'Paste Style', ( assert ) => {
				const eButtonSimple1 = Elements.createMockButtonWidget(),
					eButtonSimple2 = Elements.createMockButtonWidget(),
					eButtonStyled = Elements.createMockButtonStyled(),
					eStyledButtonBackground = eButtonStyled.settings.attributes.background_color;

				Elements.copy( eButtonStyled );

				Elements.multiPasteStyle( [ eButtonSimple1, eButtonSimple2 ] );

				// Check pasted style exist.
				assert.equal( eButtonSimple1.model.attributes.settings.attributes.background_color, eStyledButtonBackground,
					`Button #1 background color was changed to '${ eStyledButtonBackground }'.` );
				assert.equal( eButtonSimple2.model.attributes.settings.attributes.background_color, eStyledButtonBackground,
					`Button #2 background color was changed to '${ eStyledButtonBackground }'.` );
			} );

			QUnit.test( 'Reset Style', ( assert ) => {
				const eButtonStyled1 = Elements.createMockButtonStyled(),
					eButtonStyled2 = Elements.createMockButtonStyled();

				Elements.multiResetStyle( [ eButtonStyled1, eButtonStyled2 ] );

				// Check pasted style exist.
				assert.equal( eButtonStyled1.model.attributes.settings.attributes.background_color, '',
					'Button #1 with custom style were (style) restored.' );
				assert.equal( eButtonStyled2.model.attributes.settings.attributes.background_color, '',
					'Button #2 with custom style were (style) restored.' );
			} );

			QUnit.test( 'Move Sections', ( assert ) => {
				// Create Section at 0.
				Elements.createSection();

				const section1ColumnsCount = 3,
					section2ColumnsCount = 4,
					eSection1 = Elements.createSection( section1ColumnsCount ),
					eSection2 = Elements.createSection( section2ColumnsCount );

				Elements.multiMove( [ eSection1, eSection2 ], elementor.getPreviewContainer(), { at: 0 } );

				// Validate first section have 3 columns.
				assert.equal( elementor.getPreviewContainer().model.attributes.elements.first().attributes.elements.length, section1ColumnsCount,
					`Section #1, '${ section1ColumnsCount }' columns were created.` );

				// Validate second section have 4 columns.
				assert.equal( elementor.getPreviewContainer().model.attributes.elements.at( 1 ).attributes.elements.length, section2ColumnsCount,
					`Section #2, '${ section2ColumnsCount }' columns were created.` );
			} );

			QUnit.test( 'Move Columns', ( assert ) => {
				const eSection1 = Elements.createSection(),
					eSection2 = Elements.createSection(),
					eColumn1 = Elements.createColumn( eSection1 ),
					eColumn2 = Elements.createColumn( eSection1 );

				Elements.multiMove( [ eColumn1, eColumn2 ], eSection2 );

				// Validate.
				assert.equal( eSection2.view.collection.length, 3,
					'Columns were moved.' );
			} );

			QUnit.test( 'Move Widgets', ( assert ) => {
				const eSection = Elements.createSection(),
					eColumn1 = Elements.createColumn( eSection ),
					eColumn2 = Elements.createColumn( eSection ),
					eButton1 = Elements.createButton( eColumn1 ),
					eButton2 = Elements.createButton( eColumn1 );

				Elements.multiMove( [ eButton1, eButton2 ], eColumn2 );

				// Validate.
				assert.equal( eColumn1.view.collection.length, 0, 'Widgets were removed from the first column.' );
				assert.equal( eColumn2.view.collection.length, 2, 'Widgets were moved/create at the second column.' );
			} );

			QUnit.test( 'Delete', ( assert ) => {
				const eColumn = Elements.createSection( 1, true ),
				eButton1 = Elements.createButton( eColumn ),
				eButton2 = Elements.createButton( eColumn );

				Elements.multiDelete( [ eButton1, eButton2 ] );

				// Validate.
				assert.equal( eColumn.view.collection.length, 0, 'Buttons were deleted.' );
			} );
		} );
	} );
} );