/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

const fallbackFonts = [
	'ui-sans-serif',
	'system-ui',
	'-apple-system',
	'BlinkMacSystemFont',
	'Segoe UI',
	'Roboto',
	'Helvetica Neue',
	'Arial',
	'Noto Sans',
	'sans-serif',
	'Apple Color Emoji',
	'Segoe UI Emoji',
	'Segoe UI Symbol',
	'Noto Color Emoji',
]

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class', '[data-applied-mode="dark"]'],
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./pages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
	],
	theme: {
		extend: {
			fontFamily: {
				special: ['lobular', ...fallbackFonts],

				sans: ['FUNGIS', ...fallbackFonts],
				serif: ['serif'],
				mono: ['monospace'],
			},
			colors: {
				fg: 'var(--fg)',
				bg: 'var(--bg)',
				alt: 'var(--alt)',
				grayDark: 'var(--grayDark)',
				grayMed: 'var(--grayMed)',
				grayLight: 'var(--grayLight)',
				grayUltraLight: 'var(--grayUltraLight)',
			},
			backgroundImage: {
				'tooth-pattern': "url('/images/tooth-pattern.svg')",
			},
			height: { screen: '100lvh' },
			width: { screen: '100lvw' },
			screens: {
				xs: '400px',
			},
			transitionTimingFunction: {
				'out-extreme': 'cubic-bezier(.12,.98,.13,.98)',
			},
			animation: {
				swoosh: 'swoosh 4s linear infinite',
			},
		},
	},
	plugins: [
		require('@tailwindcss/container-queries'),
		require('tailwindcss-touch')(),
		plugin(({ addUtilities, addVariant }) => {
			addUtilities({
				'.text-balance': {
					'text-wrap': 'balance',
				},
				'.text-pretty': {
					'text-wrap': 'pretty',
				},
			})
		}),
	],
}
