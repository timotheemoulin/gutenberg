/**
 * External dependencies
 */
import type { Browser, Page, BrowserContext, Frame } from '@playwright/test';

/**
 * Internal dependencies
 */
import { clickBlockOptionsMenuItem } from './click-block-options-menu-item';
import { clickBlockToolbarButton } from './click-block-toolbar-button';
import { showBlockToolbar } from './show-block-toolbar';

interface EditorCanvasConstructorParams {
	page: Page;
	isIframe: boolean;
}

export class EditorCanvas {
	browser: Browser;
	page: Page;
	context: BrowserContext;
	#isIframe: boolean;

	constructor( { page, isIframe = false }: EditorCanvasConstructorParams ) {
		this.page = page;
		this.context = page.context();
		this.browser = this.context.browser()!;
		this.#isIframe = isIframe;
	}

	get canvas(): Frame | Page {
		let frame;

		if ( this.#isIframe ) {
			frame = this.page.frame( 'editor-canvas' );
		} else {
			frame = this.page;
		}

		if ( ! frame ) {
			throw new Error(
				'EditorCanvasUtils: unable to find editor canvas iframe or page'
			);
		}

		return frame;
	}

	clickBlockOptionsMenuItem = clickBlockOptionsMenuItem;
	clickBlockToolbarButton = clickBlockToolbarButton;
	showBlockToolbar = showBlockToolbar;
}
