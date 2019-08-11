import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import shader from 'rollup-plugin-shader';
import json from 'rollup-plugin-json';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		file: 'public/bundle.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	},
	plugins: [
		shader( {
			// All match files will be parsed by default,
			// but you can also specifically include/exclude files
			include: [ '**/*.glsl', '**/*.vert', '**/*.frag' ],
			// include: '**/*.glsl', // default: [ '**/*.glsl', '**/*.vs', '**/*.fs' ]
			// exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
			// specify whether to remove comments
			removeComments: true // default: true
		}),
		json({
      // All JSON files will be parsed by default,
      // but you can also specifically include/exclude files
      // include: 'node_modules/**',

      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: true, // Default: false

      // specify indentation for the generated default export —
      // defaults to '\t'
      indent: '  ',

      // ignores indent and generates the smallest code
      compact: true, // Default: false

      // generate a named export for every property of the JSON object
      namedExports: true // Default: true
    }),
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
		production && terser() // minify, but only in production
	]
};
