import type { RouterOutputs } from '@/lib/api'
import { useIsDevteam } from '@/lib/session/sessionAtom'
import { SolCard } from '@/lib/sol/containers/SolCard'
import { SolTextLink } from '@/lib/sol/inputs/SolTextLink'
import { LoadStateDiv, type RCLoadedDiv } from '@/lib/sol/states/LoadStateDiv'
import { emptyObj } from '@/utils/react-ext'
import { useNavigate } from 'react-router'
import performLogout from '../login/performLogout'
import { projectListLoader } from './projectListLoader'

export const ProjectsListPage: React.FC = () => {

	const { state } = projectListLoader.useStateWithLoader(emptyObj)

	return <div className='h-screen w-screen max-h-screen max-w-screen min-w-screen min-h-0 flex flex-col items-center justify-center'>
		<SolCard
			border='thin'
			bg='none'
			className='w-[90vw] max-w-[400px] flex flex-col items-center'
		>
			<div className='h-2 shrink-0' />
			<h1 className='text-xl lg:text-2xl dark:text-neutral-100 font-bold mb-8'>Select project</h1>

			<LoadStateDiv
				state={state}
				view={ProjectList}
			/>

			<SolTextLink underline='onhover' className='hover:!decoration-neutral-500/50 !text-sm !text-neutral-500/50 mt-3 mb-1' onClick={() => performLogout()}>Sign out</SolTextLink>
		</SolCard>
	</div>
}
const ProjectList: RCLoadedDiv<RouterOutputs['projects']['list']> = ({ data }) => {

	const isALPTeam = useIsDevteam()
	const nav = useNavigate()

	return (
		data.map((project) => (
			<SolCard
				transitionDuration='d100ms'
				border='thin'
				borderColor='neutral_light'
				bg='none'
				style={{ height: isALPTeam ? '60px' : '70px', paddingTop: !isALPTeam ? '3px' : '0' }}
				className='w-full flex flex-row items-center self-stretch bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 hover:dark:bg-neutral-900 active:bg-neutral-300/50 active:dark:bg-neutral-900/50 active:translate-y-px active:!shadow-none cursor-pointer select-none mb-3 !shadow-none dark:!shadow-sm'
				key={project.id}
				onClick={() => nav(`/main/projects/${project.id}`)}
			>

				{ isALPTeam ? <div className='line-clamp-1 text-sm'>
					<span className='text-lg uppercase font-semibold tracking-widest'>
						{project.codename}
					</span>
						&nbsp;&nbsp;
					<span className='-translate-y-0.5 relative inline-block opacity-50'>•</span>
					&nbsp;&nbsp;
					<span className='text-lg text-neutral-500'>
						{project.externalName}
					</span>
				</div> : <div>
					<p className='text-lg'>
						{ project.externalName }
					</p>
					<p className='text-xs text-neutral-500/50 uppercase tracking-widest'>
						{project.codename}
					</p>
				</div>}
			</SolCard>
		))
	)
}
