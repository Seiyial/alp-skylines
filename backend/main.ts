import { elysiaTRPCCreateContext } from '@/lib/core/trpc'
import { rootRouter } from '@/routers/root'
import { cors } from '@elysiajs/cors'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { Elysia } from 'elysia'
import { env } from './src/env'
import { healthcheckRouter } from './src/routers/healthcheckRouter'

export type BackendTRPCRoot = typeof rootRouter

const app = new Elysia()
	.get('/ping', () => 'pong')

	// 🌸 Routers
	.use(healthcheckRouter)

	// 🌸 CORS
	.use(cors({
		origin: env.CORS_WHITELISTED_ORIGINS,
		credentials: true,
		preflight: true,
		allowedHeaders: ['Content-type', 'Authorization', 'Cookie'],
		exposeHeaders: ['Set-Cookie']
	}))

	// 🌸 TRPC
	.all('/api/trpc/*', async (ctx) => {
		return fetchRequestHandler({
			endpoint: '/api/trpc',
			router: rootRouter,
			req: ctx.request,
			createContext: elysiaTRPCCreateContext,
			onError (p) {
				return p
			}
		})
	})

	.listen(env.PORT)

console.log(`🏙️  ~ Skyline ~ 🌆 (backend) is running at ${app.server?.url.protocol}//${app.server?.hostname}:${app.server?.port}`)

process.on('SIGINT', () => {
	console.log('🏙️  ~ Skyline ~ 🌆 (backend) is shutting down...')
	process.exit()
})
