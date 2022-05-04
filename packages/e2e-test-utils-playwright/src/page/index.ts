/**
 * External dependencies
 */
import type { Browser, Page, BrowserContext } from '@playwright/test';

/**
 * Internal dependencies
 */
import {
	setClipboardData,
	pressKeyWithModifier,
} from './press-key-with-modifier';
import { pressKeyTimes } from './press-key-times';
import { setBrowserViewport } from './set-browser-viewport';

class PageUtils {
	browser: Browser;
	page: Page;
	context: BrowserContext;

	constructor( page: Page ) {
		this.page = page;
		this.context = page.context();
		this.browser = this.context.browser()!;
	}

	pressKeyTimes = pressKeyTimes;
	pressKeyWithModifier = pressKeyWithModifier;
	setBrowserViewport = setBrowserViewport;
	setClipboardData = setClipboardData;
}

export { PageUtils };
