/**
 * External dependencies
 */
import type { Browser, Page, BrowserContext } from '@playwright/test';

/**
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import { createNewPost } from './create-new-post';
import { visitAdminPage } from './visit-admin-page';
import { visitSiteEditor } from './visit-site-editor';

export class Admin {
	browser: Browser;
	page: Page;
	context: BrowserContext;

	constructor( page: Page ) {
		this.page = page;
		this.context = page.context();
		this.browser = this.context.browser()!;
	}

	createNewPost = createNewPost;
	visitAdminPage = visitAdminPage;
	visitSiteEditor = visitSiteEditor;
}
