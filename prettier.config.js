module.exports = {
	trailingComma: 'all',
	tabWidth: 2,
	useTabs: true,
	semi: false,
	singleQuote: true,
	plugins: [require.resolve('prettier-plugin-astro')],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
}
