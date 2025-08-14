import { trpc as elysiaTRPC } from '@elysiajs/trpc
import { elysiaTRPCCreateContext } from '@/lib/core/trpc'
import { rootRouter } from '@/routers/root'

import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { env } from './src/env'
import { healthcheckRouter } from './src/routers/healthcheckRouter'

const app = new Elysia()
	.get('/ping', () => 'pong')
	
	// 🌸 Routers
	.use(healthcheckRouter)

	// 🌸 CORS
	.use(cors({
		origin: env.CORS_WHITELISTED_ORIGINS,
		allowedHeaders: ['Content-type', 'Authorization', 'Cookie'],
		exposeHeaders: ['Set-Cookie'],
	}))

	// 🌸 TRPC
	.use(elysiaTRPC(rootRouter, { createContext: elysiaTRPCCreateContext }))

	.listen(env.PORT)

console.log(`🦊 alps-app-name (Elysia) is running at ${app.server?.url.protocol}//${app.server?.hostname}:${app.server?.port}`)

process.on('SIGINT', () => {
	console.log('🦊 alps-app-name (Elysia) is shutting down...');
	process.exit();
})
