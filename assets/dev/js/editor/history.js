const History = {
	subItems: {},

	get( target, propKey, receiver ) {
		if ( ! target[ propKey ] ) {
			return;
		}

		const origMethod = target[ propKey ];
		return ( ...args ) => {
			const historyIsActive = elementor.history.history.getActive();

			if ( historyIsActive && this[ propKey ] ) {
				this[ propKey ].apply( this, [ args, target ] );

				// Keep sub items count in order to close the history item
				// only after all recursive items are finished.
				var currentID = elementor.history.history.getCurrentID();

				if ( ! this.subItems[ currentID ] ) {
					this.subItems[ currentID ] = 0;
				}

				this.subItems[ currentID ]++;
			}

			// don't push to args, to avoid wrong args.
			target.receiver = receiver;

			let result = origMethod.apply( target, args );

			if ( historyIsActive && this[ propKey ] ) {
				this.subItems[ currentID ]--;

				// All recursive items are finished.
				if ( ! this.subItems[ currentID ] ) {
					elementor.history.history.endItem();
					delete this.subItems[ currentID ];
				}
			}

			return result;
		};
	},

	getModelLabel( type ) {
		if ( ! Array.isArray( type ) ) {
			type = [ type ];
		}

		if ( 'document' === type[ 0 ] ) {
			return 'Document';
		}

		if ( type[ 1 ] ) {
			const config = elementor.config.widgets[ type[ 1 ] ];
			return config ? config.title : type[ 1 ];
		}

		const config = elementor.config.elements[ type[ 0 ] ];
		return config ? config.title : type[ 0 ];
	},

	create( args, target ) {
		elementor.history.history.startItem( {
			type: 'add',
			title: 1 === target.getSelection().length ? this.getModelLabel( args[ 0 ] ) : 'Elements',
			elementType: args[ 0 ],
		} );
	},

	repeaterRowAdd( args, target ) {
		const control = args[ 0 ],
			row = args[ 1 ],
			options = args[ 2 ];

		const historyItem = {
			type: 'addRow',
			title: this.getTargetLabel( target ),
			subTitle: this.getControlLabel( {}, { subChange: control }, target ),
			elements: {},
			history: {
				behavior: {
					restore: this.repeaterRowAddRestore.bind( this ),
				},
			},
		};

		target.getSelection().forEach( ( element ) => {
			const changedAttributes = {};

			changedAttributes[ control ] = {
				row: row,
				options: options,
			};

			historyItem.elements[ element.model.id ] = changedAttributes;
		} );

		elementor.history.history.addItem( historyItem );
	},

	repeaterRowAddRestore: function( historyItem, isRedo ) {
		_( historyItem.get( 'elements' ) ).each( ( settings, elementID ) => {
			const $eElement = $e( '#' + elementID );
			_( settings ).each( ( rowSettings, repeaterId ) => {
				if ( isRedo ) {
					$eElement.repeaterRowAdd( repeaterId, rowSettings.row, {
						external: true,
						options: rowSettings.options,
					} );
				} else {
					$eElement.repeaterRowRemove( repeaterId, rowSettings.options.at, {
						external: true,
					} );
				}
			} );

			$eElement.scrollToView();
		} );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );
	},

	repeaterRowRemove( args, target ) {
		const control = args[ 0 ],
			rowIndex = args[ 1 ];

		const historyItem = {
			type: 'removeRow',
			title: this.getTargetLabel( target ),
			subTitle: this.getControlLabel( {}, { subChange: control }, target ),
			elements: {},
			history: {
				behavior: {
					restore: this.repeaterRowRemoveRestore.bind( this ),
				},
			},
		};

		target.getSelection().forEach( ( element ) => {
			const changedAttributes = {},
				oldRow = element.model.get( 'settings' ).get( control ).at( rowIndex );

			changedAttributes[ control ] = {
				rowIndex: rowIndex,
				oldRow: oldRow,
			};

			historyItem.elements[ element.model.id ] = changedAttributes;
		} );

		elementor.history.history.addItem( historyItem );
	},

	repeaterRowRemoveRestore: function( historyItem, isRedo ) {
		_( historyItem.get( 'elements' ) ).each( ( settings, elementID ) => {
			const $eElement = $e( '#' + elementID );
			_( settings ).each( ( rowSettings, repeaterId ) => {
				if ( isRedo ) {
					$eElement.repeaterRowRemove( repeaterId, rowSettings.rowIndex, {
						external: true,
					} );
				} else {
					$eElement.repeaterRowAdd( repeaterId, rowSettings.oldRow, {
						external: true,
						options: { at: rowSettings.rowIndex },
					} );
				}
			} );

			$eElement.scrollToView();
		} );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );
	},

	remove( args, target ) {
		let title;
		if ( 1 === target.getSelection().length ) {
			const element = target.getSelection()[ 0 ],
				model = [ element.model.get( 'elType' ), element.model.get( 'widgetType' ) ];

			title = this.getModelLabel( model );
		} else {
			title = 'Elements';
		}

		elementor.history.history.startItem( {
			type: 'remove',
			title: title,
			elementType: args[ 0 ],
		} );
	},

	settings( args, target ) {
		const settings = args[ 0 ],
			settingsArgs = args[ 1 ] ? args[ 1 ] : {},
			settingsKeys = Object.keys( settings );

		if ( ! settingsKeys.length ) {
			return;
		}

		target.getSelection().forEach( ( element ) => {
			element.oldValues = element.oldValues || element.model.get( 'settings' ).toJSON();
		} );

		// Try delay save only for one control (like text or color picker) but if history item started e.g. Section preset during delete column - do not delay the execution.
		if ( 1 === settingsKeys.length && ! elementor.history.history.isItemStarted() ) {
			this.lazySaveChangeHistory( settings, settingsArgs, target );
		} else {
			this.saveChangeHistory( settings, settingsArgs, target );
		}
	},

	restoreChanges: function( historyItem, isRedo ) {
		_( historyItem.get( 'elements' ) ).each( ( settings, elementID ) => {
			const $eElement = $e( '#' + elementID ),
				restoredValues = {};
			_( settings ).each( ( values, key ) => {
				if ( isRedo ) {
					restoredValues[ key ] = values.new;
				} else {
					restoredValues[ key ] = values.old;
				}

				const control = $eElement.getSettings().getControl( key );

				if ( control.is_repeater ) {
					restoredValues[ key ] = this.createRepeaterCollection( restoredValues[ key ], control.fields );
				}
			} );

			$eElement.settings( restoredValues, { external: true } );
			$eElement.scrollToView();
		} );

		historyItem.set( 'status', isRedo ? 'not_applied' : 'applied' );
	},

	saveChangeHistory( settings, settingsArgs, target ) {
		const historyItem = {
			type: 'change',
			title: this.getTargetLabel( target ),
			subTitle: this.getControlLabel( settings, settingsArgs, target ),
			elements: {},
			history: {
				behavior: {
					restore: this.restoreChanges.bind( this ),
				},
			},
		};

		target.getSelection().forEach( ( element ) => {
			const changedAttributes = {};

			_.each( settings, ( value, controlName ) => {
				changedAttributes[ controlName ] = {
					old: element.oldValues[ controlName ],
					// Clone. don't save by reference.
					new: elementorCommon.helpers.cloneObject( value ),
				};
			} );

			historyItem.elements[ element.model.id ] = changedAttributes;
			delete element.oldValues;
		} );

		elementor.history.history.addItem( historyItem );
	},

	getTargetLabel: function( target ) {
		let title;
		if ( 1 === target.getSelection().length ) {
			const model = target.getSelection()[ 0 ].model;
			title = this.getModelLabel( [ model.get( 'elType' ), model.get( 'widgetType' ) ] );
		} else {
			title = 'Elements';
		}

		return title;
	},

	getControlLabel( settings, settingsArgs, target ) {
		const keys = Object.keys( settings );
		let label;

		if ( 1 === keys.length || settingsArgs.subChange ) {
			const controlKey = settingsArgs.subChange ? settingsArgs.subChange : keys[ 0 ],
				controlConfig = target.getSelection()[ 0 ].model.get( 'settings' ).controls[ controlKey ];
			label = controlConfig ? controlConfig.label : keys[ 0 ];
		} else {
			label = 'Settings';
		}

		return label;
	},

	moveTo( args, target ) {
		elementor.history.history.startItem( {
			type: 'move',
			title: this.getTargetLabel( target ),
		} );
	},

	createRepeaterCollection( value, controls ) {
		const collection = new Backbone.Collection( value, {
			// Use `partial` to supply the `this` as an argument, but not as context
			// the `_` is a place holder for original arguments: `attrs` & `options`
			model: ( attrs, options ) => {
				options = options || {};

				options.controls = controls;

				if ( ! attrs._id ) {
					attrs._id = elementor.helpers.getUniqueID();
				}

				return new elementorModules.editor.elements.models.BaseSettings( attrs, options );
			},
		} );

		return collection;
	},
};

History.lazySaveChangeHistory = _.debounce( History.saveChangeHistory.bind( History ), 800 );

export default History;
