import type { RouterOutputs } from '@/lib/api'
import { SolCard } from '@/lib/sol/containers/SolCard'
import { LoadStateDiv, type RCLoadedDiv } from '@/lib/sol/states/LoadStateDiv'
import { emptyObj } from '@/utils/react-ext'
import { useNavigate } from 'react-router'
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
		</SolCard>
	</div>
}
const ProjectList: RCLoadedDiv<RouterOutputs['projects']['list']> = ({ data }) => {
	const nav = useNavigate()
	return (
		data.map((project) => (
			<SolCard
				transitionDuration='d100ms'
				className='w-full h-[60px] flex flex-row items-center self-stretch hover:bg-neutral-100 hover:dark:bg-neutral-900 active:bg-neutral-100/50 active:dark:bg-neutral-900/50 active:translate-y-px active:!shadow-none cursor-pointer select-none mb-3'
				key={project.id}
				onClick={() => nav(`/main/projects/${project.id}`)}
			>
				<div className='line-clamp-1 text-sm'>
					<span className='text-lg uppercase font-semibold tracking-widest'>
						{project.codename}
					</span>
					&nbsp;&nbsp;
					<span className='-translate-y-0.5 relative inline-block opacity-50'>•</span>
					&nbsp;&nbsp;
					<span className='text-lg text-neutral-500'>
						{project.externalName}
					</span>
				</div>
			</SolCard>
		))
	)
}
