/**
 * External dependencies
 */
const fs = require( 'fs' );

/**
 * Babel plugin which transforms `warning` function calls to wrap within a
 * condition that checks if `process.env.NODE_ENV !== 'production'`.
 *
 * @param {import('@babel/core')} babel Current Babel object.
 *
 * @return {import('@babel/core').PluginObj} Babel plugin object.
 */
function babelPlugin( { types: t } ) {
	const seen = Symbol();

	const typeofProcessExpression = t.binaryExpression(
		'!==',
		t.unaryExpression( 'typeof', t.identifier( 'process' ), false ),
		t.stringLiteral( 'undefined' )
	);

	const processEnvExpression = t.memberExpression(
		t.identifier( 'process' ),
		t.identifier( 'env' ),
		false
	);

	const nodeEnvCheckExpression = t.binaryExpression(
		'!==',
		t.memberExpression(
			processEnvExpression,
			t.identifier( 'IS_GUTENBERG_PLUGIN' ),
			false
		),
		t.booleanLiteral( true )
	);

	const logicalExpression = t.logicalExpression(
		'&&',
		t.logicalExpression(
			'&&',
			typeofProcessExpression,
			processEnvExpression
		),
		nodeEnvCheckExpression
	);

	return {
		visitor: {
			ImportDeclaration( path, state ) {
				const currentFile = state.file.opts.filename;
				// Only transform the index.js.
				if ( ! currentFile.endsWith( 'block-library/src/index.js' ) ) {
					return;
				}
				const { node } = path;

				// Only look for wildcard imports like import * as a from "source":
				const isNamespaceSpecifier = node.specifiers.find(
					( specifier ) =>
						specifier.type === 'ImportNamespaceSpecifier'
				);
				if ( ! isNamespaceSpecifier ) {
					return;
				}

				// Only look for imports starting with ./ and without additional slashes.
				const importedPath = node.source.value;
				if (
					! importedPath?.startsWith( './' ) ||
					importedPath?.split( '/' ).length > 2
				) {
					return;
				}

				// Check the imported directory has a related block.json file.
				const blockJsonPath =
					__dirname + '/src/' + importedPath + '/block.json';
				if ( ! fs.existsSync( blockJsonPath ) ) {
					return;
				}

				const blockJSON = JSON.parse(
					fs.readFileSync( blockJsonPath )
				);
				if ( blockJSON.name === 'core/archives' ) {
					// const { name } = defaultSpecifier.local;
					state.callee.isExperimentalBlock = true;
				}
			},
			CallExpression( path, state ) {
				const currentFile = state.file.opts.filename;
				// Only transform the index.js.
				if ( ! currentFile.endsWith( 'block-library/src/index.js' ) ) {
					return;
				}

				const { node } = path;

				// Ignore if it's already been processed.
				if ( node[ seen ] ) {
					return;
				}

				const isExperimentalBlock = state.callee
					? state.callee.isExperimentalBlock
					: state.opts.callee
					? state.opts.callee.isExperimentalBlock
					: false;

				if ( isExperimentalBlock ) {
					// Turns this code:
					// warning(argument);
					// into this:
					// typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production" ? warning(argument) : void 0;
					node[ seen ] = true;
					path.replaceWith(
						t.ifStatement(
							logicalExpression,
							t.blockStatement( [
								t.expressionStatement( node ),
							] )
						)
					);
				}
			},
		},
	};
}

module.exports = babelPlugin;
