import { api } from '@/lib/api'
import { loaderPackE } from '@/lib/loaderPackE'
import { SolButton } from '@/lib/sol/inputs/SolButton'
import { cn, type RCFwdDOMElement } from '@/utils/react-ext'
import { format } from 'date-fns/format'
import { FileTextIcon, LogOutIcon, MenuIcon, SquareChevronLeftIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import performLogout from '../login/performLogout'
import type { TPrintableProjectProps } from '../project-report-page/printableProps'

export const projectDetailsLoader = loaderPackE.forFamilyPayload(
	'project-detail',
	api.projects.get.query,
	(p) => p?.id ?? '-'
)

export const ProjectHeader: RCFwdDOMElement<HTMLDivElement, { printingInject?: TPrintableProjectProps }> = ({ printingInject, ...props }) => {

	const { projectID } = useParams()
	const qProps = useMemo(() => (projectID ? ({ id: projectID }) : null), [projectID])
	const project = projectDetailsLoader.useStateWithLoader(qProps)
	const nav = useNavigate()

	return <>
		<div {...props} className={cn('px-4 py-2 flex flex-row items-start', props.className)}>
			<div>
				<p className='text-2xs flex w-full uppercase tracking-wider dark:text-primary-400 text-primary-500 py-1 pt-2'>
					Project { printingInject ? <>report, {format(printingInject.printedAt, 'dd MMMM yyyy')}</> : '' }
				</p>

				<h2 className='text-2xl text-neutral-950 dark:text-neutral-200'>
					{ printingInject?.externalName ?? (project.state.loaded
						? project.state.data
							? <>{project.state.data.externalName}</>
							: 'Error: Project Not Found'
						: 'Loading...'
					)}
					<div className='w-2 inline-block shrink-0' />
					<span
						className='text-xs font-mono font-medium dark:text-neutral-300/80 text-neutral-500/80'
					>
						({printingInject?.codename ?? (project.state.loaded ? project.state.data?.codename : '')})
					</span>
				</h2>
			</div>
			<div className='grow' />


			{ !printingInject && <SolButton shadow='none' theme='neutral_outlined_light' className='!border-0 z-20 mt-2 group relative' depress='down_px'>
				<MenuIcon className='text-neutral-300 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-500 transition-colors mx-0 my-1 size-6' />

				<div className='absolute group-hover:block hidden right-0 w-[200px] top-full z-10 bg-white dark:bg-neutral-950 shadow-sm border border-neutral-200 py-2 px-1 dark:border-neutral-800 rounded-md'>
					{/* <p className='text-xs text-neutral-500 dark:text-neutral-300'>Project Actions</p> */}

					<SolButton
						shadow='none'
						theme='neutral_transparent_to_light'
						className='w-full !justify-start items-center'
						onClick={() => nav('/main/projects')}
					>
						<SquareChevronLeftIcon className='size-4 mr-2' />
						Back to projects
					</SolButton>
					<SolButton
						shadow='none'
						theme='neutral_transparent_to_light'
						className='w-full !justify-start items-center'
						onClick={() => open(`/main/projects/${projectID}/report`, '_blank')}
					>
						<FileTextIcon className='size-4 mr-2' />
						Print report
					</SolButton>
					<SolButton
						shadow='none'
						theme='neutral_transparent_to_light'
						className='w-full !justify-start items-center'
						onClick={() => performLogout()}
					>
						<LogOutIcon className='size-4 mr-2' />
						Logout
					</SolButton>
				</div>
			</SolButton> }

			{ printingInject && (
				<SolButton className='print:hidden mt-2' shadow='none' theme='primary_filled' onClick={() => window.print()}>
					Print me!
				</SolButton>
			) }
		</div>
	</>
}
