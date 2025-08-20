import { SolTextInputRaw } from '@/lib/sol/inputs/SolTextInputRaw'
import { Writer } from '@/lib/sol/inputs/writer/Writer'
import { cn } from '@/utils/react-ext'
import { useEffect, useMemo, useState } from 'react'
import type { Descendant } from 'slate'
import { timestamps } from '../utils/timestamps'
import { PrintableEpisodeTasklist } from './PrintableEpisodeTasklist'
import type { TPrintableProjectProps } from './printableProps'

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

const clsCurrentEpDate = [
	'text-neutral-600 *:dark:text-neutral-400 text-sm px-[14px]',
	'hover:text-neutral-500 dark:hover:text-neutral-300',
	'dark:hover:bg-black/20 dark:active:bg-black/30 transition-colors',
	'hover:bg-neutral-200 active:bg-neutral-300',
	'cursor-pointer',
	'inline-block rounded-md'
].join(' ')

// COPY PASTED FROM CurrentEpisode component on Project Page
export const PrintableProjectEpisode: React.FC<{ injectEpisode: TPrintableProjectProps['episodes'][number] }> = ({ injectEpisode: ep }) => {

	const [title, setTitle] = useState(ep?.title || '')

	const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false)
	// const canwrite = useCanUserWrite()
	const canwrite = false

	useEffect(() => {
		setTitle(ep?.title || '')
	}, [ep])

	// const perfSave = async (data: { title?: string, writeup?: Descendant[], yyyymmdd?: string }) => {
	// 	if (!ep) return
	// 	return api.episodes.updateDetails.mutate({
	// 		id: ep.id,
	// 		...data
	// 	}).then((updated) => {
	// 		setEp(updated)
	// 		writeAtom(projectEpisodesLoader.immerAtom(ep.projectID), (s) => {
	// 			if (s.loaded) {
	// 				const idx = s.data.findIndex((e) => e.id === ep.id)
	// 				if (idx !== -1) {
	// 					s.data[idx] = updated
	// 				}
	// 			}
	// 		})
	// 	})
	// 		.catch((e) => {
	// 			toast('Error updating episode', errLib.logAndExtractError(e))
	// 		})
	// }

	// const perfSetStatus = async (status: 'planned' | 'current' | 'completed') => {
	// 	if (!ep) return
	// 	return api.episodes.updateDetails.mutate({
	// 		id: ep.id,
	// 		status
	// 	}).then((result) => {
	// 		setEp((prev) => prev && ({ ...prev, status }))
	// 		setAtom(projectEpisodesLoader.immerAtom(ep.projectID), (s) => {
	// 			if (s.loaded) {
	// 				const idx = s.data.findIndex((e) => e.id === ep.id)
	// 				if (idx !== -1) {
	// 					s.data[idx] = { ...s.data[idx], status }
	// 				}
	// 			}
	// 		})
	// 	})
	// }

	const dispTimestamp = useMemo(() => (ep ? timestamps.toFmt(ep.yyyymmdd) : ''), [ep])

	return ep ? <div className='px-3'>

		<div className='flex items-start'>
			<p
				className={cn(
					clsCurrentEpDate
				)}
				// onClick={() => {
				// 	const newVal = prompt('Enter a new date (YYYY-MM-DD).')
				// 	if (!newVal) return
				// 	if (/^\d{4}-\d{2}-\d{2}$/.test(newVal)) {
				// 		perfSave({ yyyymmdd: newVal })
				// 	} else {
				// 		toast('Invalid value', 'Please enter a valid date in the format YYYY-MM-DD (with dashes).')
				// 	}
				// }}
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
				{/* <SolPopoverMenuSpawner width={110} show={showStatusDropdown}>
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
				</SolPopoverMenuSpawner> */}
			</div>
		</div>
		<div className='h-1 shrink-0' />
		<SolTextInputRaw
			// onChange={(e) => setTitle(e.target.value)}
			value={title}
			// onBlur={(e) => perfSave({ title: e.target.value })}
			className='text-xl !px-3 !py-0.5 font-semibold w-full !border-transparent hover:bg-neutral-100 focus:bg-neutral-200 focus:hover:bg-neutral-200 disabled:cursor-text hover:dark:bg-black/10 focus:dark:bg-black/20 focus:hover:dark:bg-black/20'
			//  hover:!border-neutral-300 focus:!border-neutral-400 dark:hover:!border-neutral-700 dark:focus:!border-neutral-600
			disabled={!canwrite}
		/>

		{Array.isArray(ep.writeup) && (ep.writeup as unknown[]).length ? <Writer
			initialValue={ep.writeup as Descendant[] || []}
			onDebouncedValueChange={(newValue) => {
				// perfSave({ writeup: newValue })
			}}
			readonly={!canwrite}
			minHeightPx={0}
			placeholder='-'
			className='!border-transparent !px-3 hover:bg-neutral-100 focus:bg-neutral-200 focus:hover:bg-neutral-200 hover:dark:bg-black/10 focus:dark:bg-black/20 focus:hover:dark:bg-black/20'
		/> : null }

		<PrintableEpisodeTasklist injection={ep.tasks} />

		<div className='h-[30px] shrink-0' />
		<div className='px-3 shrink-0'>
			<div className='h-0.5 bg-neutral-500/30 shrink-0' />
		</div>
		<div className='h-[30px] shrink-0' />

	</div> : <div className='px-3 text-neutral-600/50'>No episode selected</div>
}
