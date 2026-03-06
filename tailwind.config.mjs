/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				neon: {
					cyan: '#00f0ff',
					magenta: '#ff00e5',
					purple: '#b000ff',
					pink: '#ff2d7b',
					blue: '#0055ff',
				},
			},
			boxShadow: {
				'neon-cyan': '0 0 8px rgba(0, 240, 255, 0.4), 0 0 24px rgba(0, 240, 255, 0.15)',
				'neon-magenta': '0 0 8px rgba(255, 0, 229, 0.4), 0 0 24px rgba(255, 0, 229, 0.15)',
				'neon-purple': '0 0 8px rgba(176, 0, 255, 0.4), 0 0 24px rgba(176, 0, 255, 0.15)',
			},
			animation: {
				'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
			},
			keyframes: {
				'pulse-glow': {
					'0%, 100%': { opacity: '0.6' },
					'50%': { opacity: '1' },
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
