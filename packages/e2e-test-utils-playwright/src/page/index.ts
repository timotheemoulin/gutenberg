/**
 * External dependencies
 */
import type { Browser, Page, BrowserContext } from '@playwright/test';

/**
 * Internal dependencies
 */
import { getPageError } from './get-page-error';
import { isCurrentURL } from './is-current-url';
import {
	setClipboardData,
	pressKeyWithModifier,
} from './press-key-with-modifier';
import { pressKeyTimes } from './press-key-times';
import { selectBlockByClientId } from '../editor/select-block-by-client-id';
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

	getPageError = getPageError;
	isCurrentURL = isCurrentURL;
	pressKeyWithModifier = pressKeyWithModifier;
	setClipboardData = setClipboardData;
	selectBlockByClientId = selectBlockByClientId;
	setBrowserViewport = setBrowserViewport;
	pressKeyTimes = pressKeyTimes;
}

export { PageUtils };
