import { api, type RouterOutputs } from '@/lib/api'
import { useCanUserWrite } from '@/lib/session/sessionAtom'
import { SolCard } from '@/lib/sol/containers/SolCard'
import { SolPopoverMenuSpawner } from '@/lib/sol/containers/SolPopover'
import { SolButton } from '@/lib/sol/inputs/SolButton'
import { SolTextInputRaw } from '@/lib/sol/inputs/SolTextInputRaw'
import { Writer } from '@/lib/sol/inputs/writer/Writer'
import { toast } from '@/lib/sol/overlays/toaster'
import { LoadStateDiv, type RCLoadedDiv } from '@/lib/sol/states/LoadStateDiv'
import { errLib } from '@/utils/errLib'
import { setAtom, writeAtom } from '@/utils/jotai-ext'
import { cn } from '@/utils/react-ext'
import { format } from 'date-fns/format'
import {
	motion
} from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import { CheckIcon, ListCheckIcon, ListTodoIcon, PlusIcon } from 'lucide-react'
import {
	useEffect, useMemo, useState
} from 'react'
import { useParams } from 'react-router'
import type { Descendant } from 'slate'
import { ProjectHeader } from '../project-header/ProjectHeader'
import { timestamps } from '../utils/timestamps'
import { projectEpisodesLoader, selectedEpisodeAtom } from './projectEpisodesLoader'
import { EpisodeTasklist } from './ProjectTasklist'
import { useDragScroll } from './useHorizDragScroll'

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

	const { projectID } = useParams()
	const props = useMemo(() => (projectID ? ({ projectID: projectID ?? '-' }) : null), [projectID])
	const episodes = projectEpisodesLoader.useStateWithLoader(props)

	const selectedEpisode = useAtomValue(selectedEpisodeAtom)

	const dragScroller = useDragScroll<HTMLDivElement>()
	const userCanWrite = useCanUserWrite()

	useEffect(() => {
		const el = dragScroller.draggableRef.current
		if (!el) return
		if (selectedEpisode) {
			const rect = document.getElementById(horizontalListItemID(selectedEpisode.id))
			if (rect) {
				const currentOffsetX = dragScroller.getCurrentOffsetX()
				const elX = rect.getBoundingClientRect().x - currentOffsetX
				const desired = -(elX - (window.innerWidth / 2) + (3.5 * 16))
				dragScroller.animateToOffsetX(desired)
			}
		}
	}, [selectedEpisode])

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
		className='h-[160px] !p-0 w-full overflow-x-hidden scrollbar-hide relative'
	>
		{ /* draggable */ }
		<motion.div
			id='scrollable'
			ref={dragScroller.draggableRef}
			className={cn(
				// 'bg-neutral-900/50',
				// also make the last one scroll into view
				'flex gap-[100px] h-full min-w-fit items-stretch px-[calc(50vw-60px)] py-2 select-none',
				'cursor-grab active:cursor-grabbing'
			)}
		>
			<LoadStateDiv
				state={episodes.state}
				view={EpisodeHorizontalList}
				loaderType='spinner'
			/>

			{
				userCanWrite && <>


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
				</>
			}
		</motion.div>

	</SolCard>
}

const horizontalListItemID = (id: string) => `episode-${id}-card`

const EpisodeHorizontalList: RCLoadedDiv<RouterOutputs['episodes']['list']> = ({ data }) => {

	const selected = useAtomValue(selectedEpisodeAtom)

	return data.map((episode) => {
		return <SolCard
			key={episode.id}
			id={horizontalListItemID(episode.id)}
			className={cn(
				'!border-2 dark:!border-0 self-center relative h-full aspect-[3/4] flex flex-col justify-center items-center cursor-pointer group !p-0',
				selected && (episode.id === selected.id)
					? 'ring-2 ring-primary-400 dark:ring-primary-700'
					: '',
				episode.completedOn
					? 'opacity-30'
					: ''
			)}
			transitionDuration='d100ms'
			shadow='sm'
			border='none'
			borderColor='neutral'
			onClick={() => setAtom(selectedEpisodeAtom, episode)}
		>
			<div className='text-2xs uppercase leading-wide dark:text-neutral-600 text-neutral-500'>
				{timestamps.toFmt(episode.yyyymmdd)}
			</div>

			<div className='grow' />

			{ episode.completedOn
				? <ListCheckIcon className='size-6 text-neutral-600 dark:text-neutral-300' />
				: <ListTodoIcon className='size-6 text-neutral-600 dark:text-neutral-300' />
			}

			<div className='h-2 shrink-0' />
			<div className='line-clamp-3 text-xs text-center px-1 font-medium dark:text-neutral-500 text-neutral-900'>{ episode.title }</div>

			<div className='grow' />

			{ episode.completedOn || episode.status === 'completed'
				? <div className='size-4 rounded-full mb-1 bg-neutral-100 dark:bg-success-600 grid place-items-center text-white/80 absolute bottom-1 left-1/2 transform -translate-x-1/2'>
					<CheckIcon className='size-3 stroke-[4] translate-y-px' />
				</div>
				: null
			}

			<div
				data-label='line-after'
				className={cn(
					'absolute top-1/2 z-10 left-full h-0.5 w-[100px] bg-neutral-500/40 dark:bg-neutral-500/20 dark:shadow-sm shadow-black/20'
				)}
			/>
		</SolCard>
	})
}

const clsCurrentEpDate = [
	'text-neutral-600 *:dark:text-neutral-400 text-sm px-[14px]',
	'hover:text-neutral-500 dark:hover:text-neutral-300',
	'dark:hover:bg-black/20 dark:active:bg-black/30 transition-colors',
	'hover:bg-neutral-200 active:bg-neutral-300',
	'cursor-pointer',
	'inline-block rounded-md'
].join(' ')

const clsCurrentEpNav = [
	'text-neutral-600 *:dark:text-neutral-400 text-sm px-[14px]',
	'hover:text-neutral-500 dark:hover:text-neutral-300',
	// 'dark:hover:bg-black/30 dark:active:bg-black/40 transition-colors',
	// 'bg-neutral-100 dark:bg-black/20',
	// 'hover:bg-neutral-200 active:bg-neutral-300',
	'transition-colors',
	'cursor-pointer',
	'inline-block rounded-md'
].join(' ')

export const CurrentEpisode: React.FC = () => {

	const [ep, setEp] = useAtom(selectedEpisodeAtom)
	const [title, setTitle] = useState(ep?.title || '')

	const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false)
	const canwrite = useCanUserWrite()

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

	const perfSetStatus = async (status: 'planned' | 'current' | 'completed') => {
		if (!ep) return
		return api.episodes.updateDetails.mutate({
			id: ep.id,
			status
		}).then((result) => {
			setEp((prev) => prev && ({ ...prev, status }))
			setAtom(projectEpisodesLoader.immerAtom(ep.projectID), (s) => {
				if (s.loaded) {
					const idx = s.data.findIndex((e) => e.id === ep.id)
					if (idx !== -1) {
						s.data[idx] = { ...s.data[idx], status }
					}
				}
			})
		})
	}

	const dispTimestamp = useMemo(() => (ep ? timestamps.toFmt(ep.yyyymmdd) : ''), [ep])

	return ep ? <div className='px-3'>

		<div className='flex items-start'>
			<p
				className={cn(
					clsCurrentEpDate
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
			</p>
			<div className='grow' />
			<div
				className={cn(
					clsCurrentEpNav,
					ep.completedOn
						? 'bg-success-100 dark:bg-success-600/5 hover:dark:bg-success-600/10 active:dark:bg-success-600/20'
						: 'bg-primary-100 dark:bg-primary-600/5 hover:dark:bg-primary-600/10 active:dark:bg-primary-600/20',
					'select-none relative'
				)}
				style={canwrite ? {} : { cursor: 'text' }}
				onClick={canwrite ? () => setShowStatusDropdown((v) => !v) : undefined}
			>
				{ ep.status === 'completed'
					? <span className='!text-success-600 dark:!text-success-400'>Completed</span>
					: <span className='!text-primary-600 dark:!text-primary-400'>{ ep.status === 'current' ? 'In progress' : 'Planned' }</span>
				}
				<SolPopoverMenuSpawner width={110} show={showStatusDropdown}>
					<SolButton
						theme='neutral_transparent_to_light'
						onClick={() => perfSetStatus('planned')}
						shadow='none'
						size='sm'
						className={cn(ep.status === 'planned' ? 'opacity-30 pointer-events-none' : '', 'justify-end')}
					>Planned</SolButton>
					<SolButton
						theme='neutral_transparent_to_light'
						onClick={() => perfSetStatus('current')}
						shadow='none'
						size='sm'
						className={cn(ep.status === 'current' ? 'opacity-30 pointer-events-none' : '', 'justify-end')}
					>Current</SolButton>
					<SolButton
						theme='neutral_transparent_to_light'
						onClick={() => perfSetStatus('completed')}
						shadow='none'
						size='sm'
						className={cn(ep.status === 'completed' ? 'opacity-30 pointer-events-none' : '', 'justify-end')}
					>Completed</SolButton>
				</SolPopoverMenuSpawner>
			</div>
		</div>
		<div className='h-1 shrink-0' />
		<SolTextInputRaw
			onChange={(e) => setTitle(e.target.value)}
			value={title}
			onBlur={(e) => perfSave({ title: e.target.value })}
			className='text-xl !px-3 !py-0.5 font-semibold w-full !border-transparent hover:bg-neutral-100 focus:bg-neutral-200 focus:hover:bg-neutral-200 disabled:cursor-text hover:dark:bg-black/10 focus:dark:bg-black/20 focus:hover:dark:bg-black/20'
			//  hover:!border-neutral-300 focus:!border-neutral-400 dark:hover:!border-neutral-700 dark:focus:!border-neutral-600
			disabled={!canwrite}
		/>

		<div className='h-6 shrink-0' />

		<Writer
			initialValue={ep.writeup as Descendant[] || [ { text: 'hello' } ]}
			onDebouncedValueChange={(newValue) => {
				console.log('onDebouncedValueChange')
				perfSave({ writeup: newValue })
			}}
			instanceKeyWithRerender={`ep:${ep.id}:writeup`}
			readonly={!canwrite}
			minHeightPx={60}
			placeholder='+ Meeting notes'
			className='!border-transparent !px-3 hover:bg-neutral-100 focus:bg-neutral-200 focus:hover:bg-neutral-200 hover:dark:bg-black/10 focus:dark:bg-black/20 focus:hover:dark:bg-black/20'
		/>

		<EpisodeTasklist episodeID={ep.id} />

		<div className='h-[30vh] shrink-0' />

	</div> : <div className='px-3 text-neutral-600/50'>No episode selected</div>
}
