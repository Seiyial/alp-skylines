import { publicRoute, router } from '../lib/core/trpc'

const healthcheckRouter = router({
	healthcheck: publicRoute
		.query(() => 'ok')
})

export const rootRouter = router({
	healthchecks: healthcheckRouter
})
