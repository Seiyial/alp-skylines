import { publicRoute, router } from '../lib/core/trpc'
import { episodesRouter } from './episodesRouter'
import { tasksRouter } from './tasksRouter'

const healthcheckRouter = router({
	healthcheck: publicRoute
		.query(() => 'ok')
})

export const rootRouter = router({
	healthchecks: healthcheckRouter,
	episodes: episodesRouter,
	tasks: tasksRouter
})
