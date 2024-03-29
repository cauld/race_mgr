module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'plugin:react/recommended',
		'xo',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: [
		'react',
		'@typescript-eslint',
	],
	rules: {
		'guard-for-in': 0,
		'no-unused-vars': 0,
		'no-negated-condition': 0,
		'no-async-promise-executor': 0,
		'prefer-promise-reject-errors': 0,
	},
};
