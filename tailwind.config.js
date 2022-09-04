// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors')

module.exports = {
	important: true,
	content: ['./src/**/*.{ts,tsx}', './public/index.html'],
	theme: {
		extend: {
			fontFamily: {
				body: [
					'iranSans',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Segoe UI"',
					'Roboto',
					'"Helvetica Neue"',
					'Arial',
					'sans-serif',
					'"Apple Color Emoji"',
					'"Segoe UI Emoji"',
					'"Segoe UI Symbol"',
				],
				Montserrat: ['Montserrat', 'sans-serif'],
				Raleway: ['Raleway', 'sans-serif'],
			},
		},
		colors: {
			...colors,
			primary: '#c5a711',
		},
	},
}
