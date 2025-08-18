import { publicRoute, router } from '../lib/core/trpc'
import { sessionRouter } from './authRouter'
import { episodesRouter } from './episodesRouter'
import { projectsRouter } from './projectsRouter'
import { tasksRouter } from './tasksRouter'

const healthcheckRouter = router({
	healthcheck: publicRoute
		.query(() => 'ok')
})

export const rootRouter = router({
	healthchecks: healthcheckRouter,
	episodes: episodesRouter,
	tasks: tasksRouter,
	sessions: sessionRouter,
	projects: projectsRouter
})
