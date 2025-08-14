import { createTRPCProxyClient, httpLink } from '@trpc/client'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import superjson from 'superjson'
import type { BackendTRPCRoot } from '../../../backend/main'
import { env } from '../env'

export const api = createTRPCProxyClient<BackendTRPCRoot>({
	transformer: superjson,
	links: [
		httpLink({
			url: env.FRONTEND_PUBLIC_API_URL + '/api/trpc',
			fetch: (url, options) => fetch(url, { ...options, credentials: 'include' })
		})
	]
})

export type RouterOutputs = inferRouterOutputs<BackendTRPCRoot>
export type RouterInputs = inferRouterInputs<BackendTRPCRoot>
