module.exports = ( api ) => {
	api.cache( true );

	return {
		presets: [ '@wordpress/babel-preset-default' ],
		plugins: [
			require.resolve( '@wordpress/block-library/babel-plugin' ),
			'@emotion/babel-plugin',
			'babel-plugin-inline-json-import',
		],
	};
};
