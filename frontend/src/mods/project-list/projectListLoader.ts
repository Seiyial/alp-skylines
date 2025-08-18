import { api } from '@/lib/api'
import { loaderPackE } from '@/lib/loaderPackE'

export const projectListLoader = loaderPackE.forSingularStorePayload(
	'project-list',
	api.projects.list.query
)
