/**
 * Checks if the block is experimental based on the metadata loaded
 * from block.json.
 *
 * This function is in a separate file and uses the older JS syntax so
 * that it can be used in both:
 * * block-library/src/index.js
 * * block-library/src/is-block-metadata-experimental.js
 *
 * @param {Object} metadata Parsed block.json metadata.
 * @return {boolean} Is the block experimental?
 */
module.exports = function isBlockMetadataExperimental( metadata ) {
	return (
		metadata &&
		'__experimental' in metadata &&
		metadata.__experimental !== 'no'
	);
};
