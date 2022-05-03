<?php
/**
 * Post featured image block tests.
 *
 * @package WordPress
 * @subpackage Blocks
 */

/**
 * Post featured image block tests.
 *
 * @group blocks
 */
class Tests_Blocks_RenderFeaturedImage extends WP_UnitTestCase {
	protected static $attachments = array();

	public static function wpSetUpBeforeClass( WP_UnitTest_Factory $factory ) {
		$file = DIR_TESTDATA . '/images/canola.jpg';
		$now  = time();

		for ( $i = 0; $i <= 3; $i ++ ) {
			$post_date = gmdate( 'Y-m-d H:i:s', $now - ( 10 * $i ) );
			$post      = $factory->post->create(
				array(
					'post_date' => $post_date,
				)
			);

			self::$attachments[ $i ] = $factory->attachment->create_upload_object( $file, $post );
			set_post_thumbnail( $post, self::$attachments[ $i ] );
		}
	}

	public static function tear_down_after_class() {
		foreach ( self::$attachments as $attachment_id ) {
			wp_delete_post( $attachment_id, true );
		}
		parent::tear_down_after_class();
	}

	/**
	 * @covers render_block_core_post_featured_image
	 */
	public function test_render_block_core_post_featured_image() {
		$a = new MockAction();
		add_filter( 'update_post_metadata_cache', array( $a, 'filter' ), 10, 2 );
		query_posts( array() );

		while ( have_posts() ) {
			the_post();
			$block = new WP_Block(
				array(
					'blockName' => 'core/post-featured-image',
				),
				array(
					'postId' => get_the_ID(),
				)
			);
			render_block_core_post_featured_image(
				array(
					'height'   => 200,
					'sizeSlug' => 'post-thumbnail',
					'width'    => 200,
				),
				'',
				$block
			);
		}

		// Reset Query.
		wp_reset_query();
		$args      = $a->get_args();
		$last_args = end( $args );
		$this->assertSame( self::$attachments, $last_args[1] );
	}

}
