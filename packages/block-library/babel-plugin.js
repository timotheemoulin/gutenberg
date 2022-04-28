/**
 * External dependencies
 */
const fs = require( 'fs' );

/**
 * Internal dependencies
 */
const isBlockMetadataExperimental = require( './src/is-block-metadata-experimental' );

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
				// Only transform block-library/src/index.js.
				if ( ! currentFile.endsWith( 'block-library/src/index.js' ) ) {
					return;
				}

				// Only look for wildcard imports like import * as a from "source":
				const { node } = path;
				const namespaceSpecifier = node.specifiers.find(
					( specifier ) =>
						specifier.type === 'ImportNamespaceSpecifier'
				);
				if ( ! namespaceSpecifier || ! namespaceSpecifier.local ) {
					return;
				}

				// Only look for imports starting with ./ and without additional slashes in the path.
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

				// Read the block.json file related to this block
				const { name } = namespaceSpecifier.local;
				let blockJSONBuffer;
				try {
					blockJSONBuffer = fs.readFileSync( blockJsonPath );
				} catch ( e ) {
					process.stderr.write(
						'Could not read block.json for the module "' +
							importedPath +
							'" imported under name "' +
							name +
							'" from path "' +
							blockJsonPath +
							'"'
					);
					throw e;
				}
				let blockJSON;
				try {
					blockJSON = JSON.parse( blockJSONBuffer );
				} catch ( e ) {
					process.stderr.write(
						'Could not parse block.json for the module "' +
							importedPath +
							'" imported under name "' +
							name +
							'" read from path "' +
							blockJsonPath +
							'"'
					);
					throw e;
				}

				// Only process the experimental blocks.
				if ( ! isBlockMetadataExperimental( blockJSON ) ) {
					return;
				}

				// Keep track of all the imported identifiers of the experimental blocks.
				state.experimentalNames = [ name ].concat(
					state.experimentalNames || []
				);
			},
			Identifier( path, state ) {
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

				// Ignore if not used in an expression (but, say, a statement).
				if ( ! path.isExpression( path.parent ) ) {
					return;
				}

				// Ignore if it's not one of the experimental blocks identified in the ImportDeclaration visitor.
				const names = state.experimentalNames || [];
				const isExperimentalBlock =
					names
						.map( ( name ) => path.isIdentifier( { name } ) )
						.filter( ( x ) => x ).length > 0;

				if ( ! isExperimentalBlock ) {
					return;
				}

				// Turns this code:
				//
				//    archives,
				//
				// into this:
				//
				//    typeof process !== "undefined" &&
				//       process.env &&
				//       process.env.IS_GUTENBERG_PLUGIN === true ? archives : void 0;
				//
				node[ seen ] = true;
				path.replaceWith(
					t.ifStatement(
						logicalExpression,
						t.blockStatement( [ t.expressionStatement( node ) ] )
					)
				);
			},
		},
	};
}

module.exports = babelPlugin;
