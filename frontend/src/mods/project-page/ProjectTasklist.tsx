import { api, type RouterOutputs } from '@/lib/api'
import { loaderPackE } from '@/lib/loaderPackE'
import { useCanUserWrite } from '@/lib/session/sessionAtom'
import { SolPopoverMenuSpawner } from '@/lib/sol/containers/SolPopover'
import { SolButton } from '@/lib/sol/inputs/SolButton'
import { SolTextInputRaw } from '@/lib/sol/inputs/SolTextInputRaw'
import { toast } from '@/lib/sol/overlays/toaster'
import { LoadStateDivExtended, type RCLoadedDivExtended } from '@/lib/sol/states/LoadStateDiv'
import { dom } from '@/utils/dom-ext'
import { errLib } from '@/utils/errLib'
import { setAtom, writeAtom } from '@/utils/jotai-ext'
import { cn } from '@/utils/react-ext'
import type { TaskStatus } from '@s/generated/prisma'
import {
	CheckSquareIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon, EditIcon, InfoIcon, ListTodoIcon, MoreHorizontalIcon, PlayIcon, SquareIcon, TrashIcon, XIcon
} from 'lucide-react'
import { useMemo, useState } from 'react'

const tasksLoader = loaderPackE.forFamilyPayload(
	'tasks',
	api.tasks.list.query,
	(p) => p?.episodeID ?? '-'
)

const nextStatus = (status: TaskStatus): TaskStatus => {
	if (status === 'TODO') return 'DROPPED'
	if (status === 'DROPPED') return 'IN_PROGRESS'
	if (status === 'IN_PROGRESS') return 'DEFERRED'
	if (status === 'DEFERRED') return 'DONE'
	if (status === 'DONE') return 'OTHER'
	return 'TODO'
}

export const EpisodeTasklist: React.FC<{ episodeID: string }> = ({ episodeID }) => {

	const memoProps = useMemo(() => (episodeID ? ({ episodeID }) : null), [episodeID])
	const tasks = tasksLoader.useStateWithLoader(memoProps)

	return <LoadStateDivExtended
		state={tasks.state}
		view={Tasklist}
		passthrough={{ episodeID }}
	/>
}

const Tasklist: RCLoadedDivExtended<RouterOutputs['tasks']['list'], { episodeID: string }> = ({ data, passthrough: { episodeID } }) => {

	const canWrite = useCanUserWrite()

	const [newTaskTitle, setNewTaskTitle] = useState('')
	const [newTaskIndent, setNewTaskIndent] = useState(0)
	const [showContextMenuTaskID, setShowContextMenuTaskID] = useState<string | null>(null)

	const perfAddTask = () => {
		api.tasks.create.mutate({
			episodeID,
			title: newTaskTitle,
			status: 'TODO',
			orderIdx: data.length,
			indent: newTaskIndent
		}).then((task) => {
			setNewTaskTitle('')
			document.getElementById('task-adder-box')?.focus()
			setAtom(tasksLoader.immerAtom(episodeID), (s) => {
				if (!s.loaded) return
				s.data.push(task)
			})
		})
			.catch((e) => {
				toast('Failed to add task', errLib.logAndExtractError(e))
			})
	}

	const deltaIndent = async (taskID: string, setTo: number) => {
		return api.tasks.updateDetails.mutate({
			id: taskID,
			indent: setTo
		}).then(() => {
			setAtom(tasksLoader.immerAtom(episodeID), (s) => {
				if (!s.loaded) return
				const task = s.data.find((t) => t.id === taskID)
				if (task) {
					task.indent = Math.max(0, Math.min(3, setTo))
				}
			})
		})
			.catch((e) => {
				toast('Failed to change task indent', errLib.logAndExtractError(e))
			})
	}

	return (
		<div className='pt-3 flex flex-col items-stretch'>
			{ data.length > 0 ? <div className='text-lg font-normal text-neutral-500/50 mb-1 mt-3 px-3 flex items-center'>
				<ListTodoIcon className='size-5 mr-2 mt-[2px]' />
				Items
			</div> : null }
			{data.map((task) => (
				<div
					className='px-[9px] min-h-[34px] h-fit relative rounded-md hover:dark:bg-black/20 transition-colors text-sm flex flex-row items-start group/task'
					key={task.id}
					style={task.indent > 0 ? { width: `calc(100% - ${task.indent * 24}px)`, marginLeft: `${task.indent * 24}px` } : {}}
				>
					<div
						className={cn(canWrite ? '' : 'pointer-events-none', 'p-1.5 mt-0.5 mr-0.5 hover:dark:bg-black/20 hover:active:dark:bg-black/40 hover:bg-neutral-200 active:hover:bg-neutral-300 rounded-md text-neutral-500 hover:!text-primary-500 cursor-pointer transition-colors group')}
						onClick={() => api.tasks.updateDetails.mutate({ status: nextStatus(task.status), id: task.id })
							.then(() => {
								writeAtom(tasksLoader.immerAtom(task.episodeID), (s) => {
									if (s.loaded) {
										const idx = s.data.findIndex((t) => t.id === task.id)
										if (idx !== -1) {
											s.data[idx].status = nextStatus(task.status)
										}
									}
								})
							})
						}
					>
						{ task.status === 'TODO' && <SquareIcon className='size-[18px]' /> }
						{ task.status === 'DROPPED' && <XIcon className='size-[18px] text-neutral-500' /> }
						{ task.status === 'IN_PROGRESS' && <PlayIcon className='size-[18px] text-amber-500 fill-amber-500' /> }
						{ task.status === 'DEFERRED' && <ChevronsRightIcon className='size-[18px] dark:text-purple-400 text-purple-500 group-hover:dark:text-purple-400 group-hover:text-purple-600' /> }
						{ task.status === 'DONE' && <CheckSquareIcon className='size-[18px] text-success-500 group-hover:text-primary-500' /> }
						{ task.status === 'OTHER' && <InfoIcon className='size-[18px] text-neutral-500' /> }
					</div>
					<div className='py-[7px] select-none'>
						{ task.status === 'DEFERRED' && <span className='dark:text-purple-400 text-purple-500 text-xs'>Deferred&nbsp;&nbsp;</span> }
						{ task.status === 'DROPPED' && <span className='text-neutral-500/80 text-xs'>Dropped&nbsp;&nbsp;</span> }
						{task.title}

					</div>

					<div
						style={{ pointerEvents: canWrite ? 'auto' : 'none' }}
						className='absolute opacity-0 group-hover/task:opacity-50 hover:opacity-100 group-hover/task:hover:opacity-100 right-0.5 top-0.5 p-1.5 cursor-pointer group/optionbtn transition-opacity hover:dark:bg-black/20 hover:bg-neutral-200 rounded-md active:dark:bg-black/40 active:bg-neutral-300'
						onClick={() => (showContextMenuTaskID === task.id
							? setShowContextMenuTaskID(null)
							: setShowContextMenuTaskID(task.id)
						)}
					>
						<MoreHorizontalIcon className='size-[18px] text-neutral-500 group-hover/optionbtn:dark:text-neutral-300 group-hover/optionbtn:text-neutral-700 transition-colors' />

						<SolPopoverMenuSpawner
							width={160}
							show={showContextMenuTaskID === task.id}
							onClose={() => setShowContextMenuTaskID(null)}
						>
							<div className='flex items-center justify-center'>
								<SolButton
									theme='neutral_transparent_to_light'
									onClick={dom.only(() => deltaIndent(task.id, task.indent - 1))}
									shadow='none'
									className='!px-2'
								>
									<ChevronLeftIcon className={cn('size-4', task.indent === 0 ? 'pointer-events-none opacity-40' : '')} />
								</SolButton>
								<div className='px-2'>Indent: { task.indent }</div>
								<SolButton
									theme='neutral_transparent_to_light'
									onClick={dom.only(() => deltaIndent(task.id, task.indent + 1))}
									shadow='none'
									className='!px-2'
								>
									<ChevronRightIcon className={cn('size-4', task.indent === 3 ? 'pointer-events-none opacity-40' : '')} />
								</SolButton>
							</div>
							<div className='h-1 shrink-0' />
							<SolButton
								theme='neutral_transparent_to_light'
								onClick={dom.only((e) => {
									const newTitle = prompt('Enter new title:', task.title)
									if (newTitle?.trim()) {
										api.tasks.updateDetails.mutate({ title: newTitle, id: task.id })
											.then(() => {
												writeAtom(tasksLoader.immerAtom(task.episodeID), (s) => {
													if (s.loaded) {
														const idx = s.data.findIndex((t) => t.id === task.id)
														if (idx !== -1) {
															s.data[idx].title = newTitle
														}
													}
												})
											})
											.catch((e) => {
												toast('Failed to update task', errLib.logAndExtractError(e))
											})
									}
								})}
								shadow='none'
								size='sm'
								className='!px-1.5 !py-1.5 gap-2 !justify-start'
							>
								<EditIcon className={cn('mx-2 size-4', task.indent === 3 ? 'pointer-events-none opacity-40' : '')} />
								Rename
							</SolButton>
							<SolButton
								theme='neutral_transparent_to_light'
								onClick={dom.only((e) => {
									const sure = confirm('Are you sure you want to delete this task?')
									if (sure) {
										api.tasks.deleteTask.mutate({ id: task.id })
											.then(() => {
												writeAtom(tasksLoader.immerAtom(task.episodeID), (s) => {
													if (s.loaded) {
														const idx = s.data.findIndex((t) => t.id === task.id)
														if (idx !== -1) {
															s.data.splice(idx, 1)
														}
													}
												})
											})
											.catch((e) => {
												toast('Failed to delete task', errLib.logAndExtractError(e))
											})
									}
								})}
								shadow='none'
								size='sm'
								className='!px-1.5 !py-1.5 gap-2 !justify-start'
							>
								<TrashIcon className={cn('mx-2 size-4', task.indent === 3 ? 'pointer-events-none opacity-40' : '')} />
								Delete
							</SolButton>
						</SolPopoverMenuSpawner>
					</div>
				</div>
			))}

			<SolTextInputRaw
				id='task-adder-box'
				bg='darkFocusing'
				autoComplete='off'
				placeholder='+ Action items'
				className={cn(
					'text-sm !px-3 mt-0.5',
					!canWrite ? 'hidden' : ''
				)}
				style={{
					marginLeft: `${(newTaskIndent * 24) + 6}px`,
					width: `calc(100% - ${(newTaskIndent * 24)}px - 6px)`
				}}
				borderColour='none'
				value={newTaskTitle}
				onChange={(e) => setNewTaskTitle(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						perfAddTask()
					} else if (e.key === 'Tab') {
						e.preventDefault()
						if (e.shiftKey) {
							setNewTaskIndent((i) => Math.max(0, i - 1))
						} else {
							setNewTaskIndent((i) => Math.min(i + 1, 3))
						}
					}
				}}
			/>
		</div>
	)
}
