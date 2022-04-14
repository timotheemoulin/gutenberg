/**
 * Internal dependencies
 */
import type { EditorCanvas } from './index';

/**
 * Clicks a block toolbar button.
 *
 * @param {EditorCanvas} this
 * @param {string}       label The text string of the button label.
 */
export async function clickBlockOptionsMenuItem(
	this: EditorCanvas,
	label: string
) {
	await this.clickBlockToolbarButton( 'Options' );
	await this.page
		.locator(
			`role=menu[name="Options"i] >> role=menu-item[name="${ label }"i]`
		)
		.click();
}
