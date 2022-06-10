import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 3001,
	},
	plugins: [
		react({
			babel: {
				plugins: [
					'babel-plugin-macros',
					// 'babel-plugin-styled-components'
				],
			},
		}),
		eslintPlugin(),
	],
	resolve: {
		alias: [{ find: '@', replacement: '/src' }],
		mainFields: ['browser', 'module', 'main', 'jsnext:main', 'jsnext'],
	},
})
