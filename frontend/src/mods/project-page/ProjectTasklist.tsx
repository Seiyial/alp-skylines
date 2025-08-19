import { api, type RouterOutputs } from '@/lib/api'
import { loaderPackE } from '@/lib/loaderPackE'
import { SolTextInputRaw } from '@/lib/sol/inputs/SolTextInputRaw'
import { toast } from '@/lib/sol/overlays/toaster'
import { LoadStateDivExtended, type RCLoadedDivExtended } from '@/lib/sol/states/LoadStateDiv'
import { errLib } from '@/utils/errLib'
import { setAtom } from '@/utils/jotai-ext'
import { ListTodoIcon, SquareIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

const tasksLoader = loaderPackE.forFamilyPayload(
	'tasks',
	api.tasks.list.query,
	(p) => p?.episodeID ?? '-'
)

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

	const [newTaskTitle, setNewTaskTitle] = useState('')
	const perfAddTask = () => {
		api.tasks.create.mutate({
			episodeID,
			title: newTaskTitle,
			status: 'TODO',
			orderIdx: data.length
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

	return (
		<div className='pt-3'>
			{ data.length > 0 ? <div className='text-lg font-normal text-neutral-500/50 mb-1 mt-3 px-3 flex items-center'>
				<ListTodoIcon className='size-5 mr-2 mt-[2px]' />
				Items
			</div> : null }
			{data.map((task) => (
				<div className='px-[14px] py-2 rounded-md hover:dark:bg-black/10 transition-colors text-sm flex flex-row items-start' key={task.id}>
					<SquareIcon className='size-[18px] mr-[10px] text-neutral-500 mt-px' />
					<div className=''>{task.title}</div>
				</div>
			))}
			<SolTextInputRaw
				id='task-adder-box'
				bg='darkFocusing'
				autoComplete='off'
				placeholder='+ Action items'
				className='text-sm !px-3 w-full'
				borderColour='none'
				value={newTaskTitle}
				onChange={(e) => setNewTaskTitle(e.target.value)}
				onKeyDown={({ key }) => {
					if (key === 'Enter') {
						perfAddTask()
					}
				}}
			/>
		</div>
	)
}
