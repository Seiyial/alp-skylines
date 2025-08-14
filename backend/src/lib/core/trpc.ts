import { sessions } from '@/lib/auth/sessions'
import { initTRPC } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import cookie from 'cookie'
import superjson from 'superjson'

// could optimise by putting cookie parsing into validating session token in admin only
// https://elysiajs.com/blog/integrate-trpc-with-elysia#trpc-config-and-context
export const elysiaTRPCCreateContext = async (opts: FetchCreateContextFnOptions) => {

	const reqCookie = opts.req.headers.get('cookie')
	const parsedCookie = cookie.parse(reqCookie || '')
	const sessionToken = parsedCookie['__app-name-short_sid']

	return {
		session: sessionToken ? await sessions.validateSessionToken(sessionToken) : null,
		cookieValueIfAny: sessionToken,
		resHeaders: opts.resHeaders
	}
}

export const trpcApp = initTRPC
	.context<typeof elysiaTRPCCreateContext>()
	.create({
		transformer: superjson,
		errorFormatter: undefined,
		/** determines whether stacktraces will be returned */
		isDev: process.env.NODE_ENV === 'development'
	})

export const router = trpcApp.router
// export const route = trpcApp.procedure

export const publicRoute = trpcApp.procedure
export const route = trpcApp.procedure
	.use((state) => {
		if (state.ctx.session === null) {
			throw new Error('Not authenticated.')
		}
		return state.next()
	})
export const superAdminRoute = trpcApp.procedure
	.use((state) => {
		if (state.ctx.session === null || !state.ctx.session.user.isSuperAdmin) {
			throw new Error('Not authorised.')
		}
		return state.next()
	})