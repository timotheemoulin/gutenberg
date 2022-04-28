/**
 *
 *
 * @param  block
 * @return {boolean}
 */
module.exports = function isBlockMetadataExperimental( metadata ) {
	return (
		metadata &&
		'__experimental' in metadata &&
		metadata.__experimental !== 'no'
	);
};
