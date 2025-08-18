import type { BackendTRPCRoot } from '@s/../main'
import { createTRPCProxyClient, httpLink } from '@trpc/client'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import superjson from 'superjson'
import { env } from '../env'

export const api = createTRPCProxyClient<BackendTRPCRoot>({
	links: [
		httpLink({
			transformer: superjson,
			url: env.FRONTEND_PUBLIC_API_URL + '/api/trpc',
			fetch: (input: URL | RequestInfo, init?: RequestInit) => {
				return fetch(input, { ...init, credentials: 'include' })
			}
		})
	]
})

export type RouterOutputs = inferRouterOutputs<BackendTRPCRoot>
export type RouterInputs = inferRouterInputs<BackendTRPCRoot>
