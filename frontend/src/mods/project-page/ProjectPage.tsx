import { api, type RouterOutputs } from '@/lib/api'
import { SolCard } from '@/lib/sol/containers/SolCard'
import { LoadStateDiv, type RCLoadedDiv } from '@/lib/sol/states/LoadStateDiv'
import { setAtom, writeAtom } from '@/utils/jotai-ext'
import { cn } from '@/utils/react-ext'
import { format } from 'date-fns/format'
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { CheckIcon, PlusIcon } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { useParams } from 'react-router'
import { ProjectHeader } from '../project-header/ProjectHeader'
import { projectEpisodesLoader, selectedEpisodeAtom } from './projectEpisodesLoader'

export const ProjectPage: React.FC = () => {

	const { projectID } = useParams()

	return <div
		className='min-h-screen max-h-screen flex flex-col items-stretch justify-start'
	>
		<ProjectHeader />

		<div className='h-2 shrink-0' />

		<div className='px-3'>
			{ projectID && <ProjectEpisodeTimeline /> }
		</div>

		<div className='p-3 shrink-0' />
		<CurrentEpisode />
	</div>
}

export const ProjectEpisodeTimeline: React.FC = () => {

	const x = useMotionValue(0)
	const ref = useRef<HTMLDivElement>(null)
	const { projectID } = useParams()
	const props = useMemo(() => (projectID ? ({ projectID: projectID ?? '-' }) : null), [projectID])
	const episodes = projectEpisodesLoader.useStateWithLoader(props)

	useAnimationFrame(() => {
		const el = ref.current
		if (!el) return
		// invert because dragging right should move scrollLeft left
		el.scrollLeft = -x.get()
	})

	const perfCreateNewEpisode = async () => {
		return api.episodes.create.mutate({
			title: format(new Date(), 'EEE, d MMM'),
			projectID: projectID!
		}).then((newEp) => {
			props && writeAtom(projectEpisodesLoader.immerAtom(props), (s) => {
				if (!s.loaded) return
				s.data.push(newEp)
			})
			writeAtom(selectedEpisodeAtom, newEp)
		})
	}

	return <SolCard
		bg='base_darker'
		className='h-[160px] w-full overflow-hidden relative'
	>
		{ /* draggable */ }
		<motion.div
			ref={ref}
			className={cn(
				'flex gap-[200px] h-full items-stretch overflow-x-auto snap-x snap-mandatory px-6 py-2 scroll-px-6 select-none cursor-grab active:cursor-grabbing',
				'[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
			)}
			drag='x'
			dragConstraints={{ left: 0, right: 0 }}
			dragElastic={0.5}
			style={{ x }} // FM animates x with inertia on release
		>
			<LoadStateDiv
				state={episodes.state}
				view={EpisodeHorizontalList}
				loaderType='spinner'
			/>

			<SolCard
				className={cn(
					'aspect-[3/4] snap-center h-full flex flex-col justify-center items-center border-dashed cursor-pointer gap-3 group',
					'border-neutral-200 hover:border-neutral-300 active:border-neutral-400 hover:active:border-neutral-400',
					'dark:!border-neutral-800/30 dark:hover:!border-neutral-800/80 dark:active:!border-neutral-800 dark:hover:active:!border-neutral-800',
					'active:bg-neutral-600/5 transition-colors'
				)}
				transitionDuration='d100ms'
				shadow='none'
				bg='none'
				border='medium'
				onClick={perfCreateNewEpisode}
			>
				<PlusIcon className='size-8 dark:text-neutral-800/30 dark:group-hover:text-neutral-800/80' />
			</SolCard>

			{ episodes.state.loaded && episodes.state.data.length === 0 && <p className='self-center pl-2 text-neutral-500'>
				Click to start creating an episode.
			</p> }
		</motion.div>

	</SolCard>
}

const todayYear = new Date().getFullYear()
const EpisodeHorizontalList: RCLoadedDiv<RouterOutputs['episodes']['list']> = ({ data }) => {

	const selected = useAtomValue(selectedEpisodeAtom)

	return data.map((episode) => {
		return <SolCard
			className={cn(
				'self-center h-full aspect-[3/4] flex flex-col justify-center items-center cursor-pointer gap-3 group !p-0',
				selected && episode.id === selected.id ? 'ring-2 ring-primary-800' : ''
			)}
			transitionDuration='d100ms'
			shadow='sm'
			border='none'
			borderColor='neutral'
			onClick={() => setAtom(selectedEpisodeAtom, episode)}
		>
			<div className='text-xs uppercase leading-wide dark:text-neutral-600 text-neutral-300'>
				{format(new Date(episode.createdAt), episode.createdAt.getFullYear() === todayYear ? 'EEE, d MMM' : 'd MMM yyyy')}
			</div>
			<div className='grow' />

			{ episode.completedOn ? <div className='size-4 rounded-full mb-1 bg-neutral-100 dark:bg-black grid place-items-center text-white/80'>
				<CheckIcon className='size-3 stroke-[4] translate-y-px' />
			</div> : <div className='size-4'></div> }
		</SolCard>
	})
}

export const CurrentEpisode: React.FC = () => {
	const ep = useAtomValue(selectedEpisodeAtom)
	return ep ? <div>
		<h2>{ep.title}</h2>
		<p>{ep.description}</p>
	</div> : <div className='px-3 text-neutral-600/50'>No episode selected</div>
}
