import eslintJS from '@eslint/js'
// import eslintPluginNext from '@next/eslint-plugin-next'
import stylisticAll from '@stylistic/eslint-plugin'
import eslintPluginReact from 'eslint-plugin-react'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

// bun add -D @eslint/js @stylistic/eslint-plugin globals eslint-plugin-react typescript-eslint

export default typescriptEslint.config(
	{
		// for some reason, eslint doesn't like / know how to check itself
		ignores: ['eslint.config.js', 'node_modules', '*/node_modules']
	},
	{
		languageOptions: {
			parser: typescriptEslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		name: 'typescript-base-with-tsserver',
		files: ['**/*.{ts,tsx}'],
		plugins: {
			'ts': typescriptEslint.plugin,
			'js-esl': eslintJS
		},
		// this ruleset expects tsserver to be running.
		// so errors caught by tsserver are not repeated here.
		rules: {
			'ts/adjacent-overload-signatures': 'warn',
			'ts/array-type': 'off',
			'arrow-body-style': 'off',
			'ts/await-thenable': 'warn',
			// 'ts/consistent-type-definitions': ['warn', 'type'], // off if this doesn't allow us to use interface Window {}
			'ts/consistent-type-exports': ['warn', { fixMixedExportsWithInlineTypeSpecifier: false }],
			'ts/consistent-type-imports': ['warn', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }], // we want inline when there are value & type imports, separate when only type imports, but welp
			'getter-return': 'warn',
			'default-case': 'warn',
			'default-case-last': 'error',
			'eqeqeq': 'warn',
			'func-name-matching': 'warn',
			'guard-for-in': 'warn', // expect `Object.hasOwn(k, obj)` in every for-in loop
			// 'ts/init-declarations': 'warn', // it's dangerous. Use `let x: T | null = null` instead.
			'logical-assignment-operators': 'warn',
			'ts/non-nullable-type-assertion-style': 'warn',
			'ts/no-array-constructor': 'warn', // Array(0) vs Array(0, 1, 2) is completely diff
			'ts/no-array-delete': 'warn',
			'ts/no-base-to-string': 'warn',
			'ts/no-confusing-non-null-assertion': 'off', // ithink unnec
			'no-caller': 'error',
			'no-case-declarations': 'error',
			'no-class-assign': 'off', // TS handles it
			'no-compare-neg-zero': 'error',
			'no-cond-assign': 'error',
			'no-constant-binary-expression': 'warn',
			'no-constant-condition': 'warn',
			'no-constructor-return': 'warn',
			'no-control-regex': 'error',
			'no-debugger': 'warn',
			'no-div-regex': 'off', // idt we ever do this
			'no-dupe-else-if': 'error',
			'no-duplicate-case': 'error',
			'no-empty-character-class': 'warn',
			'no-eval': 'error',
			'ts/no-extra-non-null-assertion': 'warn',
			'no-ex-assign': 'error',
			'no-fallthrough': 'error',
			'ts/no-floating-promises': 'off',
			'ts/no-for-in-array': 'warn',
			'ts/no-implied-eval': 'error',
			'ts/no-import-type-side-effects': 'warn',
			'no-invalid-regexp': 'error',
			'ts/no-invalid-this': 'error',
			'ts/no-invalid-void-type': 'warn',
			'no-irregular-whitespace': 'error',
			'no-iterator': 'error', // __iterator__ property
			'no-label-var': 'warn',
			'ts/no-loop-func': 'warn',
			'no-loss-of-precision': 'error',
			'ts/no-magic-numbers': 'off',
			'no-misleading-character-class': 'error',
			'ts/no-misused-promises': 'off',
			'ts/no-mixed-enums': 'warn',
			'no-new-native-nonconstructor': 'error',
			'ts/no-non-null-asserted-nullish-coalescing': 'warn',
			'ts/no-non-null-asserted-optional-chain': 'warn',
			'no-obj-calls': 'error',
			'no-proto': 'warn',
			'no-prototype-builtins': 'error',
			'no-regex-spaces': 'warn',
			'no-self-assign': 'warn',
			'no-self-compare': 'warn',
			'no-setter-return': 'error',
			'no-sparse-arrays': 'error',
			'no-template-curly-in-string': 'error',
			'no-this-before-super': 'error',
			'ts/no-unnecessary-condition': 'off', // for extensibility
			'ts/no-unnecessary-parameter-property-assignment': 'warn',
			'ts/no-unnecessary-type-arguments': 'off', // this is required for us in React
			'ts/no-unnecessary-type-assertion': 'warn',
			'ts/no-unnecessary-type-constraint': 'off', // this is required for us in React
			'no-unreachable': 'warn',
			'ts/no-unsafe-call': 'off',
			'ts/no-unsafe-enum-comparison': 'warn',
			'ts/no-unsafe-declaration-merging': 'warn',
			'ts/no-unsafe-function-type': 'warn', // use (...args: any[]) => any if really that wild
			'no-unsafe-finally': 'off',
			'ts/no-unsafe-member-access': 'off', // we need to do our typeof mashups
			'ts/no-unsafe-unary-minus': 'warn',
			'no-unused-private-class-members': 'off',
			'ts/no-unused-vars': 'off',
			'ts/no-use-before-define': 'off',
			'no-useless-assignment': 'off',
			'no-useless-backreference': 'error',
			'ts/no-useless-empty-export': 'error',
			'no-useless-private-class-members': 'off',
			'ts/no-wrapper-object-types': 'warn',
			'ts/only-throw-error': 'warn',
			'object-shorthand': ['warn', 'properties', { avoidQuotes: true }],
			'ts/prefer-as-const': 'warn',
			'prefer-exponentiation-operator': 'warn',
			'ts/prefer-find': 'warn',
			'ts/prefer-for-of': 'warn',
			'ts/prefer-includes': 'warn',
			'prefer-numeric-literals': 'warn',
			'prefer-object-has-own': 'warn',
			'prefer-object-spread': 'warn', // see how
			'ts/prefer-nullish-coalescing': ['warn', { ignorePrimitives: { string: true } }],
			'ts/prefer-optional-chain': 'warn',
			'ts/prefer-promise-reject-errors': 'warn',
			'ts/prefer-readonly': 'warn',
			'ts/prefer-reduce-type-parameter': 'off', // we've never made mistakes here + it looks nicer
			'prefer-regex-literals': 'warn',
			'prefer-rest-params': 'error',
			'prefer-spread': 'warn',
			'ts/prefer-ts-expect-error': 'warn',
			'ts/promise-function-async': 'off', // gives false positives in Portal renderers
			'radix': 'off',
			'require-yield': 'warn',
			'ts/restrict-plus-operands': 'warn',
			'ts/restrict-template-expressions': 'warn',
			'sort-imports': 'off',
			'ts/strict-boolean-expressions': 'off',
			'ts/unbound-method': 'off', // we use it for portaler and we have safe usage with arrow funcs
			'use-isnan': 'error',
			'ts/use-unknown-in-catch-callback-variable': 'off',
			'yoda': 'warn', // lol
		}
	},
	{
		name: 'typescript-stylistic',
		files: ['**/*.{ts,tsx}'],
		plugins: {
			'st': stylisticAll
		},
		rules: {
			'st/array-bracket-newline': ['warn', { multiline: true, minItems: 4 }],
			'st/array-bracket-spacing': ['warn', 'never', { objectsInArrays: true, arraysInArrays: true }],
			'st/array-element-newline': ['warn', 'consistent', { multiline: true, minItems: 4 }],
			'st/arrow-parens': ['warn', 'always'],
			'st/arrow-spacing': ['warn', { before: true, after: true }],
			'st/block-spacing': ['warn', 'always'],
			'st/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
			'st/comma-dangle': ['warn', 'never'],
			'st/comma-spacing': ['warn', { before: false, after: true }],
			'st/comma-style': ['warn', 'last', { exceptions: { SequenceExpression: true, FunctionExpression: true, } }], // functionExpression for the useEffect props // if this is too messy we can drop
			'st/computed-property-spacing': ['warn', 'never'],
			'st/curly-newline': ['warn', { multiline: true, consistent: true }],
			'st/dot-location': ['warn', 'property'],
			'st/eol-last': ['warn', 'always'],
			// 'st/func-call-spacing': ['warn', 'never'],
			'st/function-paren-newline': ['warn', 'consistent'],
			'st/generator-star-spacing': ['warn', "after"],
			'st/implicit-arrow-linebreak': ['warn', 'beside'],
			'st/indent': ['warn', 'tab', { SwitchCase: 1, offsetTernaryExpressions: false, flatTernaryExpressions: true, tabLength: 3 }],
			'st/indent-binary-ops': ['warn', 'tab'],
			'st/key-spacing': ['warn', { beforeColon: false, afterColon: true, mode: 'strict' }],
			'st/keyword-spacing': ['warn', { before: true, after: true }],
			'st/line-comment-position': 'off',
			'st/linebreak-style': 'off', // we can on our own ensure all windows checks in as LF
			'st/max-statements-per-line': 'off',
			'st/member-delimiter-style': ['warn', { multiline: { delimiter: 'comma', requireLast: false }, singleline: { delimiter: 'comma', requireLast: false } }],
			'st/new-parens': ['warn', 'always'],
			'st/newline-per-chained-call': ['warn', { ignoreChainWithDepth: 2 }], // just a trial
			'st/no-confusing-arrow': 'warn',
			'st/no-extra-parens': 'off',
			'st/no-extra-semi': 'warn',
			'st/no-floating-decimal': 'warn',
			'st/no-mixed-operators': 'warn',
			'st/no-mixed-spaces-and-tabs': 'warn',
			'st/no-multi-spaces': 'warn',
			'st/no-trailing-spaces': 'warn',
			'st/no-whitespace-before-property': 'warn',
			'st/nonblock-statement-body-position': ['warn', 'any'],
			'st/object-curly-newline': ['warn', {
				ImportDeclaration: { multiline: true, consistent: true, minProperties: 5 },
				ObjectExpression: { multiline: true, consistent: true, minProperties: 4 },
				ObjectPattern: { multiline: true, consistent: true, minProperties: 4 },
				ExportDeclaration: { multiline: true, consistent: true, minProperties: 4 }
			}],
			'st/object-curly-spacing': ['warn', 'always'],
			'st/object-property-newline': ['warn', { allowAllPropertiesOnSameLine: true }],
			'st/one-var-declaration-per-line': ['warn', 'initializations'],
			'st/operator-linebreak': ['warn', 'before', { overrides: { '=': 'after' } }],
			'st/quote-props': 'off',
			'st/quotes': ['warn', 'single', { avoidEscape: true }],
			'st/rest-spread-spacing': ['warn', 'never'],
			'st/semi': ['warn', 'never'],
			'st/semi-spacing': ['warn', { before: false, after: true }],
			'st/semi-style': ['warn', 'last'],
			'st/space-before-blocks': ['warn', 'always'],
			'st/space-before-function-paren': ['warn', { anonymous: 'always', named: 'always', asyncArrow: 'always' }],
			'st/space-in-parens': ['warn', 'never'],
			'st/space-infix-ops': ['warn', { int32Hint: false }],
			'st/space-unary-ops': ['warn', { words: true, nonwords: false }],
			'st/spaced-comment': ['warn', 'always'],
			'st/switch-colon-spacing': ['warn', { after: true, before: false }],
			'st/template-curly-spacing': ['warn', 'never'],
			'st/template-tag-spacing': ['warn', 'never'],
			'st/type-annotation-spacing': ['warn', { before: false, after: true, overrides: { "arrow": { "before": true, "after": true } } }],
			'st/type-generic-spacing': ['warn'],
			'st/type-named-tuple-spacing': 'warn',
			'st/wrap-iife': ['warn', 'inside'],
			'st/yield-star-spacing': ['warn', 'after'],
		},
	},
	{
		name: 'tsx-stylistic',
		files: ['**/*.{tsx}'],
		plugins: {
			'st': stylisticAll
		},
		rules: {
			'st/jsx-child-element-spacing': 'warn', // trial
			'st/jsx-closing-bracket-location': ['warn', 'line-aligned'],
			'st/jsx-closing-tag-location': ['warn', 'line-aligned'],
			'st/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
			// 'st/jsx-curly-newline': ['warn', { multiline: 'consistent', singleline: 'consistent' }],
			// yeahhh we use { data.map((x, i) => \n<div key={i}>{x}</div>\n)\n } so it's bad
			'st/jsx-curly-spacing': ['warn', { children: { when: 'always' }, when: 'never' }],
			'st/jsx-equals-spacing': ['warn', 'never'],
			'st/jsx-first-prop-new-line': ['warn', 'multiline'],
			'st/jsx-fragments': ['warn', 'syntax'],
			'st/jsx-indent': ['warn', 'tab', { indentLogicalExpressions: false, ignoreTernaryOperator: true }],
			'st/jsx-indent-props': ['warn', 'tab'],
			'st/jsx-max-props-per-line': ['warn', { maximum: { single: 3, multi: 1 }, when: 'always' }], // can change `when` to `multiline` to check for multiline jsx only
			'st/jsx-one-expression-per-line': 'off',
			'st/jsx-pascal-case': 'warn',
			'st/jsx-props-no-multi-spaces': 'warn',
			'st/jsx-quotes': ['warn', 'prefer-single', { avoidEscape: true }],
			'st/jsx-self-closing-comp': ['warn', { component: true, html: true }],
			'st/jsx-sort-props': ['warn', { callbacksLast: true, shorthandFirst: true, reservedFirst: true, multiline: 'last' }],
			'st/jsx-tag-spacing': ['warn', { closingSlash: 'never', beforeSelfClosing: 'always', afterOpening: 'never', beforeClosing: 'never' }],
			'st/jsx-wrap-multilines': ['warn', {
				declaration: 'parens-new-line',
				assignment: 'parens-new-line',
				return: 'ignore',
				arrow: 'parens-new-line',
				condition: 'ignore',
				logical: 'ignore',
				prop: 'ignore'
			}],
		}
	},
	{
		name: 'react',
		files: ['**/*.{tsx}'],
		plugins: {
			'react': eslintPluginReact,
			// we don't need eslintpluginreacthooks tbh
			// 'hooks': eslintPluginReactHooks
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				}
			},
			globals: {
				...globals.browser
			}
		},
		rules: {
			'react/jsx-no-target-blank': 'warn',
			'react/jsx-no-leaked-render': 'warn',
			'react/jsx-boolean-value': ['warn', 'never'],
			'react/no-deprecated': 'warn',
			'react/no-find-dom-node': 'warn',
		}
	},
	// {
	// 	name: 'nextjs',
	// 	files: ['**/*.{tsx}'],
	// 	plugins: {
	// 		'@next/next': eslintPluginNext
	// 	},
	// 	rules: {
	// 		...eslintPluginNext.configs.recommended.rules,
	// 		...eslintPluginNext.configs['core-web-vitals'].rules
	// 	}
	// }
)

// bun add -D @eslint/js @stylistic/eslint-plugin globals eslint-plugin-react typescript-eslint