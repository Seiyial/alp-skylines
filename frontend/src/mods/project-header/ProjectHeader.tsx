import { api } from '@/lib/api'
import { loaderPackE } from '@/lib/loaderPackE'
import { cn, type RCFwdDOMElement } from '@/utils/react-ext'
import { useMemo } from 'react'
import { useParams } from 'react-router'

export const projectDetailsLoader = loaderPackE.forFamilyPayload(
	'project-detail',
	api.projects.get.query,
	(p) => p?.id ?? '-'
)

export const ProjectHeader: RCFwdDOMElement<HTMLDivElement> = ({ ...props }) => {

	const { projectID } = useParams()
	const qProps = useMemo(() => (projectID ? ({ id: projectID }) : null), [projectID])
	const project = projectDetailsLoader.useStateWithLoader(qProps)

	return <>
		<div {...props} className={cn('px-4 py-2', props.className)}>
			<p className='text-2xs uppercase tracking-wider dark:text-primary-400/70 text-primary-500 py-1 pt-2'>Project overview</p>
			<h2 className='text-2xl text-neutral-950 dark:text-neutral-200'>
				{ project.state.loaded ? project.state.data ? <>{project.state.data.externalName}</> : 'Error: Project Not Found' : 'Loading...' }
				<div className='w-2 inline-block shrink-0' />
				<span className='text-xs font-mono font-medium dark:text-neutral-300/80 text-neutral-500/80'>({project.state.loaded ? project.state.data?.codename : ''})
				</span>
			</h2>
		</div>
	</>
}
