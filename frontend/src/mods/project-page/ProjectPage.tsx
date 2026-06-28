import { api, type RouterOutputs } from '@/lib/api'
import { useCanUserWrite } from '@/lib/session/sessionAtom'
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
import { useAtom, useAtomValue } from 'jotai'
import { CheckIcon, CircleIcon, PlayIcon, PlusIcon } from 'lucide-react'
import {
	Fragment, useEffect, useMemo, useState
} from 'react'
import { useParams } from 'react-router'
import type { Descendant } from 'slate'
import { ProjectHeader } from '../project-header/ProjectHeader'
import { timestamps } from '../utils/timestamps'
import { episodeSidebarOpenAtom, projectEpisodesLoader, selectedEpisodeAtom } from './projectEpisodesLoader'
import { EpisodeTasklist } from './ProjectTasklist'

export const ProjectPage: React.FC = () => {

	const { projectID } = useParams()

	return <div
		className='min-h-screen max-h-screen flex flex-col items-stretch justify-start'
	>
		<ProjectHeader />

		<div className='flex grow min-h-0'>
			{ projectID && <ProjectEpisodeSidebar /> }
			<div className='flex-1 min-w-0 overflow-y-auto'>
				<CurrentEpisode />
			</div>
		</div>
	</div>
}

const _simpleShorten = (title: string) => {
	let t = title.trim()
	t = t.replace('Simulation', 'Sim.')
	t = t.replace('simulation', 'sim.')
	t = t.replace('version', 'ver.')
	t = t.replace('Version', 'Ver.')
	t = t.replace('Meeting', 'Mtg.')
	t = t.replace('meeting', 'mtg.')
	return t
}

export const ProjectEpisodeSidebar: React.FC = () => {

	const { projectID } = useParams()
	const props = useMemo(() => (projectID ? ({ projectID: projectID ?? '-' }) : null), [projectID])
	const episodes = projectEpisodesLoader.useStateWithLoader(props)
	const open = useAtomValue(episodeSidebarOpenAtom)
	const userCanWrite = useCanUserWrite()

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

	if (!open || !projectID) return null

	return (
		<div className='w-60 shrink-0 flex flex-col m-2 ml-6 rounded-md border border-neutral-200 dark:border-neutral-800/60 overflow-hidden'>
			<div className='flex items-center justify-between px-2.5 py-1.5 shrink-0 border-b border-neutral-200/70 dark:border-neutral-800/60'>
				<span className='text-2xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>Episodes</span>
				{ userCanWrite && <button
					type='button'
					onClick={perfCreateNewEpisode}
					title='New episode'
					className='p-1 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-black/20 transition-colors cursor-pointer'
				>
					<PlusIcon className='size-4' />
				</button> }
			</div>

			<div className='flex-1 overflow-y-auto py-1 px-1.5'>
				<LoadStateDiv
					state={episodes.state}
					view={EpisodeSidebarList}
					loaderType='spinner'
				/>
				{ episodes.state.loaded && episodes.state.data.length === 0 && userCanWrite && (
					<p className='px-2.5 py-2 text-xs text-neutral-500/60'>Click + to start creating an episode.</p>
				) }
			</div>
		</div>
	)
}

type Episode = RouterOutputs['episodes']['list'][number]

const EpisodeSidebarList: RCLoadedDiv<RouterOutputs['episodes']['list']> = ({ data }) => {

	const selected = useAtomValue(selectedEpisodeAtom)
	// Backend returns oldest-first (by timestamp). Reverse for latest-on-top.
	const ordered = data.slice().reverse()
	let lastYear: string | null = null

	return (
		<div className='flex flex-col'>
			{ordered.map((episode) => {
				const year = (episode.yyyymmdd || '').slice(0, 4) || '—'
				const showYearHeader = year !== lastYear
				lastYear = year
				return (
					<Fragment key={episode.id}>
						{ showYearHeader && (
							<div className='px-2.5 mt-2 mb-0.5 text-2xs font-mono uppercase tracking-wider text-neutral-400/80 dark:text-neutral-500/70'>
								{ year }
							</div>
						) }
						<EpisodeSidebarItem episode={episode} selected={selected} />
					</Fragment>
				)
			})}
		</div>
	)
}

const EpisodeSidebarItem: React.FC<{ episode: Episode, selected: Episode | null }> = ({ episode, selected }) => {

	const completed = Boolean(episode.completedOn) || episode.status === 'completed'
	const inProgress = episode.status === 'current'
	const isSel = Boolean(selected && episode.id === selected.id)

	return (
		<button
			type='button'
			onClick={() => setAtom(selectedEpisodeAtom, episode)}
			className={cn(
				'cursor-pointer group flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-md transition-colors',
				isSel
					? 'bg-primary-100 dark:bg-primary-600/10'
					: 'hover:bg-neutral-100 dark:hover:bg-black/15',
				completed && !isSel ? 'opacity-60' : ''
			)}
		>
			{ completed
				? <CheckIcon className='size-4 shrink-0 text-success-500' />
				: inProgress
					? <PlayIcon className='size-4 shrink-0 text-amber-500 fill-amber-500' />
					: <CircleIcon className='size-4 shrink-0 text-neutral-300 dark:text-neutral-700' /> }

			<span className='font-mono text-xs uppercase tracking-tight shrink-0 text-neutral-300 dark:text-neutral-600 translate-y-[1.5px]'>
				{ timestamps.toMonDay(episode.yyyymmdd) }
			</span>

			<span className='text-xs font-medium truncate text-neutral-800 dark:text-neutral-200'>{ _simpleShorten(episode.title) }</span>
		</button>
	)
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

	return ep ? <div className='px-3 pt-2'>

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
			<div className='w-2 shrink-0' />
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
