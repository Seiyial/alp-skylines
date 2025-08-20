import { api } from '@/lib/api'
import { loaderPackE } from '@/lib/loaderPackE'
import { LoadStateDiv, type RCLoadedDiv } from '@/lib/sol/states/LoadStateDiv'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { ProjectHeader } from '../project-header/ProjectHeader'
import type { TPrintableProjectProps } from './printableProps'
import { PrintableProjectEpisode } from './ProjectEpisode'

const projectPageFullLoader = loaderPackE.forSingularStorePayload(
	'project-page-full',
	api.projects.getComplete.query
)

export const ProjectReportPage: React.FC = () => {

	const { projectID } = useParams<{ projectID: string }>()
	const props = useMemo(() => (projectID ? ({ id: projectID }) : null), [projectID])
	const load = projectPageFullLoader.useStateWithLoader(props)

	return <LoadStateDiv state={load.state} view={ProjectReportPropagated} />
}

const ProjectReportPropagated: RCLoadedDiv<TPrintableProjectProps> = ({ data }) => {
	return (
		<>
			<ProjectHeader printingInject={data} />

			<div className='h-4 shrink-0' />

			<p className='text-sm/relaxed'>{ data.description }</p>

			<div className='h-4 shrink-0' />

			{ data.episodes.map((episode) => {
				return <PrintableProjectEpisode injectEpisode={episode} key={episode.id} />
			})}
		</>
	)
}
