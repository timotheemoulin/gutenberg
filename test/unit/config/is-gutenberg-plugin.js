/*
Package.json defines IS_GUTENBERG_PLUGIN as follows:

	"config": {
		"IS_GUTENBERG_PLUGIN": true
	}

Unfortunately, in here, it gets stringified like this:

  "true" === process.env.npm_package_config_IS_GUTENBERG_PLUGIN

Webpack replaces the occurrences of IS_GUTENBERG_PLUGIN with the boolean
value, and the unit tests need to do the same.

This code below converts the string value to its boolean counterpart,
or preserves the original string in case it contains some unexpected
value.
*/
const isPluginRaw = process.env.npm_package_config_IS_GUTENBERG_PLUGIN;
let isPlugin;
if ( isPluginRaw === 'true' ) {
	isPlugin = true;
} else if ( isPluginRaw === 'false' ) {
	isPlugin = false;
} else {
	isPlugin = isPluginRaw;
}

global.process.env = {
	...global.process.env,
	// Inject the `IS_GUTENBERG_PLUGIN` global, used for feature flagging.
	// eslint-disable-next-line @wordpress/is-gutenberg-plugin
	IS_GUTENBERG_PLUGIN: isPlugin,
};
