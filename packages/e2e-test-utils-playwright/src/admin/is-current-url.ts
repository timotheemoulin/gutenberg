/**
 * Internal dependencies
 */
import { WP_BASE_URL } from '../config';
import type { Admin } from './';

/**
 * Checks if current URL is a WordPress path.
 *
 * @param {Admin}  this
 * @param {string} WPPath String to be serialized as pathname.
 * @return {boolean} Boolean represents whether current URL is or not a WordPress path.
 */
export function isCurrentURL( this: Admin, WPPath: string ) {
	const currentURL = new URL( this.page.url() );
	const expectedURL = new URL( WPPath, WP_BASE_URL );

	return expectedURL.pathname === currentURL.pathname;
}
