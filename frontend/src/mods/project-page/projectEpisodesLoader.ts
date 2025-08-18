import { api, type RouterOutputs } from '@/lib/api'
import { loaderPackE } from '@/lib/loaderPackE'
import { atom } from 'jotai'

export const projectEpisodesLoader = loaderPackE.forFamilyPayload(
	'project-episodes',
	api.episodes.list.query,
	(p) => p?.projectID ?? '-'
)

export const selectedEpisodeAtom = atom<RouterOutputs['episodes']['list'][number] | null>(null)
