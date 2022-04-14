/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import type { PageUtils } from './index';

const CANVAS_SELECTOR = 'iframe[title="Editor canvas"i]';

interface SiteEditorQueryParams {
	postId: string | number;
	postType: string;
}

/**
 * Visits the Site Editor main page
 *
 * By default, it also skips the welcome guide. The option can be disabled if need be.
 *
 * @param {PageUtils}             this
 * @param {SiteEditorQueryParams} query            Query params to be serialized as query portion of URL.
 * @param {boolean}               skipWelcomeGuide Whether to skip the welcome guide as part of the navigation.
 */
export async function visitSiteEditor(
	this: PageUtils,
	query: SiteEditorQueryParams,
	skipWelcomeGuide = true
) {
	const path = addQueryArgs( '', {
		page: 'gutenberg-edit-site',
		...query,
	} ).slice( 1 );

	await this.visitAdminPage( 'themes.php', path );
	await this.page.waitForSelector( CANVAS_SELECTOR );

	if ( skipWelcomeGuide ) {
		await this.page.evaluate( () => {
			// TODO, type `window.wp`.
			// @ts-ignore
			window.wp.data
				.dispatch( 'core/preferences' )
				.set( 'core/edit-site', 'welcomeGuide', false );

			// @ts-ignore
			window.wp.data
				.dispatch( 'core/preferences' )
				.toggle( 'core/edit-site', 'welcomeGuideStyles', false );
		} );
	}
}

/**
 * Save entities in the site editor. Assumes the editor is in a dirty state.
 *
 * @param {PageUtils} this
 */
export async function saveSiteEditorEntities( this: PageUtils ) {
	await this.page
		.locator( 'role=region[name="Header"i] >> role=button[name="Save"i]' )
		.click();

	// The sidebar entities panel opens with another save button. Click this too.
	await this.page
		.locator( 'role=region[name="Publish"i] >> role=button[name="Save"i]' )
		.click();

	// The panel will close revealing the main editor save button again.
	// It will have the classname `.is-busy` while saving. Wait for it to
	// not have that classname.
	// TODO - find a way to improve this selector to use role/name.
	await this.page.waitForSelector(
		'.edit-site-save-button__button:not(.is-busy)'
	);
}

export async function getCanvas( this: PageUtils ) {
	return this.page.frameLocator( CANVAS_SELECTOR );
}
