import { api, type RouterOutputs } from '@/lib/api'
import { SolCard } from '@/lib/sol/containers/SolCard'
import { SolTextInputRaw } from '@/lib/sol/inputs/SolTextInputRaw'
import { Writer } from '@/lib/sol/inputs/writer/Writer'
import { toast } from '@/lib/sol/overlays/toaster'
import { LoadStateDiv, type RCLoadedDiv } from '@/lib/sol/states/LoadStateDiv'
import { errLib } from '@/utils/errLib'
import { setAtom, writeAtom } from '@/utils/jotai-ext'
import { cn } from '@/utils/react-ext'
import { format } from 'date-fns/format'
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import { CheckIcon, ListCheckIcon, ListTodoIcon, PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import type { Descendant } from 'slate'
import { ProjectHeader } from '../project-header/ProjectHeader'
import { timestamps } from '../utils/timestamps'
import { projectEpisodesLoader, selectedEpisodeAtom } from './projectEpisodesLoader'
import { EpisodeTasklist } from './ProjectTasklist'

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
			props && writeAtom(projectEpisodesLoader.immerAtom(props.projectID), (s) => {
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
			key={episode.id}
			className={cn(
				'self-center relative h-full aspect-[3/4] flex flex-col justify-center items-center cursor-pointer group !p-0',
				selected && episode.id === selected.id ? 'ring-2 ring-primary-800' : ''
			)}
			transitionDuration='d100ms'
			shadow='sm'
			border='none'
			borderColor='neutral'
			onClick={() => setAtom(selectedEpisodeAtom, episode)}
		>
			<div className='text-2xs uppercase leading-wide dark:text-neutral-600 text-neutral-300'>
				{timestamps.toFmt(episode.yyyymmdd)}
			</div>
			<div className='grow' />
			{ episode.completedOn ? <ListCheckIcon className='size-6' /> : <ListTodoIcon className='size-6' /> }
			<div className='h-2 shrink-0' />
			<div className='line-clamp-2 text-xs text-center px-1 font-medium text-neutral-500'>{ episode.title }</div>
			<div className='grow' />

			{ episode.completedOn ? <div className='size-4 rounded-full mb-1 bg-neutral-100 dark:bg-black grid place-items-center text-white/80'>
				<CheckIcon className='size-3 stroke-[4] translate-y-px' />
			</div> : <div className='size-4'></div> }

			<div
				className={cn(
					'absolute top-1/2 z-10 left-full h-0.5 w-[200px] bg-neutral-500/20 shadow-sm shadow-black/20'
				)}
			/>
		</SolCard>
	})
}

export const CurrentEpisode: React.FC = () => {

	const [ep, setEp] = useAtom(selectedEpisodeAtom)
	const [title, setTitle] = useState(ep?.title || '')

	useEffect(() => {
		setTitle(ep?.title || '')
	}, [ep])

	const perfSave = async (data: { title?: string, writeup?: Descendant[], yyyymmdd?: string }) => {
		if (!ep) return
		return api.episodes.updateDetails.mutate({
			id: ep.id,
			...data
		}).then((updated) => {
			setEp(updated)
			writeAtom(projectEpisodesLoader.immerAtom(ep.projectID), (s) => {
				if (s.loaded) {
					const idx = s.data.findIndex((e) => e.id === ep.id)
					if (idx !== -1) {
						s.data[idx] = updated
					}
				}
			})
		})
			.catch((e) => {
				toast('Error updating episode', errLib.logAndExtractError(e))
			})
	}

	const dispTimestamp = useMemo(() => (ep ? timestamps.toFmt(ep.yyyymmdd) : ''), [ep])

	return ep ? <div className='px-3'>

		<div>
			<span
				className={cn(
					'text-neutral-600 *:dark:text-neutral-400 text-sm px-[14px]',
					'hover:text-neutral-500 dark:hover:text-neutral-300',
					'dark:hover:bg-black/20 dark:active:bg-black/30 transition-colors',
					'hover:bg-neutral-200 active:bg-neutral-300',
					'cursor-pointer',
					'inline-block rounded-md'
				)}
				onClick={() => {
					const newVal = prompt('Enter a new date (YYYY-MM-DD).')
					if (!newVal) return
					if (/^\d{4}-\d{2}-\d{2}$/.test(newVal)) {
						perfSave({ yyyymmdd: newVal })
					} else {
						toast('Invalid value', 'Please enter a valid date in the format YYYY-MM-DD (with dashes).')
					}
				}}
			>
				{ dispTimestamp }
			</span>
		</div>
		<div className='h-1 shrink-0' />
		<SolTextInputRaw
			onChange={(e) => setTitle(e.target.value)}
			value={title}
			onBlur={(e) => perfSave({ title: e.target.value })}
			className='text-xl !px-3 !py-0.5 font-semibold w-full !border-transparent hover:bg-neutral-100 focus:bg-neutral-200 focus:hover:bg-neutral-200 hover:dark:bg-black/10 focus:dark:bg-black/20 focus:hover:dark:bg-black/20'
			//  hover:!border-neutral-300 focus:!border-neutral-400 dark:hover:!border-neutral-700 dark:focus:!border-neutral-600
		/>

		<div className='h-6 shrink-0' />

		<Writer
			initialValue={ep.writeup as Descendant[]}
			onDebouncedValueChange={(newValue) => {
				perfSave({ writeup: newValue })
			}}
			minHeightPx={60}
			placeholder='+ Meeting notes'
			className='!border-transparent !px-3 hover:bg-neutral-100 focus:bg-neutral-200 focus:hover:bg-neutral-200 hover:dark:bg-black/10 focus:dark:bg-black/20 focus:hover:dark:bg-black/20'
		/>

		<EpisodeTasklist episodeID={ep.id} />

	</div> : <div className='px-3 text-neutral-600/50'>No episode selected</div>
}
