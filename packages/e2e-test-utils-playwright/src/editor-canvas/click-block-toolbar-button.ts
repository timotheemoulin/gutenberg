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
export async function clickBlockToolbarButton(
	this: EditorCanvas,
	label: string
) {
	await this.showBlockToolbar();

	const blockToolbar = this.canvas.locator(
		'role=toolbar[name="Block tools"i]'
	);
	const button = blockToolbar.locator( `role=button[name="${ label }"]` );

	await button.click();
}
