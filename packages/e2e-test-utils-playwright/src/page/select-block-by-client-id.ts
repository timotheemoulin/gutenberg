/**
 * Internal dependencies
 */
import type { PageUtils } from './index';

export async function selectBlockByClientId(
	this: PageUtils,
	clientId: string
) {
	await this.page.evaluate( ( id: string ) => {
		// @ts-ignore
		wp.data.dispatch( 'core/block-editor' ).selectBlock( id );
	}, clientId );
}
