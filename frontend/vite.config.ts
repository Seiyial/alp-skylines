import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(() => {
	return {
		plugins: [
			react(),
			tsconfigPaths(),
			tailwindcss()
		],
		// expose for t3-oss/env-core
		envPrefix: 'FRONTEND_PUBLIC_',
		server: {
			port: Number(process.env.PORT) || 8001
		},
		clearScreen: false
	}
})
