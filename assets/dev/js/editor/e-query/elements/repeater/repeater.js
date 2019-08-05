import Commands from './commands/commands';

export default class Repeater {
	/***
	 * Function constructor().
	 *
	 * Create's repeater class.
	 *
	 * @param {{}} data
	 */
	constructor( data ) {
		// @TODO: should be changed to `this.selected or this.selection = data.elements`;
		this.elements = data.elements;
		this.key = data.key;

		this.currentIndex = null;
	}

	/**
	 * Function getSelection().
	 *
	 * Return current selection.
	 *
	 * @returns {{}}
	 */
	getSelection() {
		return this.elements;
	}

	/**
	 * Function getSetting().
	 *
	 * Return setting by key.
	 *
	 * @param key
	 *
	 * @returns {*}
	 */
	getSetting( key ) {
		return this.getItemModel( this.getSelection()[ 0 ], this.currentIndex ).get( key );
	}

	/**
	 * Function getItem().
	 *
	 * Return `this.receiver` and sets the current index.
	 *
	 * @param index
	 *
	 * @returns {Repeater}
	 */
	getItem( index ) {
		this.checkSelectionItemExist( index );

		this.setIndex( index );

		return this;
	}

	/**
	 * Function getItemModel().
	 *
	 * Return item model.
	 *
	 * @param element
	 * @param {Number} index
	 *
	 * @returns {*}
	 */
	getItemModel( element, index ) {
		return element.getEditModel().get( 'settings' ).get( this.key ).at( index );
	}

	/**
	 * Function setIndex().
	 *
	 * Set's the current index.
	 *
	 * @param {Number} index
	 */
	setIndex( index ) {
		this.currentIndex = index;
	}

	/**
	 * Function insert().
	 *
	 * Insert new item
	 *
	 * @param {{}} item
	 * @param {{}} args
	 */
	insert( item, args = {} ) {
		( new Commands.Insert( this ) ).run( { item, args } );

		return this;
	}

	/**
	 * Function settings().
	 *
	 * Set Item settings.
	 *
	 * @param {{}} settings
	 */
	settings( settings ) {
		( new Commands.Settings( this ) ).run( { settings } );

		return this;
	}

	/**
	 * Function duplicate().
	 *
	 * Duplicate item.
	 */
	duplicate() {
		( new Commands.Duplicate( this ) ).run( { } );

		return this;
	}

	/**
	 * Function remove().
	 *
	 * Remove item.
	 */
	remove() {
		( new Commands.Remove( this ) ).run( { } );

		return this;
	}

	/**
	 * Function move().
	 *
	 * Move item to specific absolute position.
	 *
	 * @param {Number} toIndex
	 */
	move( toIndex ) {
		( new Commands.Move( this ) ).run( { toIndex } );

		return this;
	}

	/**
	 * Function checkSelectionItemExist().
	 *
	 * Check if selected item exist.
	 *
	 * @param {Number} index
	 *
	 * @throws Error
	 */
	checkSelectionItemExist( index ) {
		// Check if item exist.
		this.getSelection().forEach( ( element ) => {
			if ( ! this.getItemModel( element, index ) ) {
				throw Error( `index: '${ index }' does not exist.` );
			}
		} );
	}
}
