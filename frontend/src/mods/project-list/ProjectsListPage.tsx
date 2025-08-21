import { api, type RouterOutputs } from '@/lib/api'
import { useIsDevteam, useIsSuperAdmin } from '@/lib/session/sessionAtom'
import { SolCard } from '@/lib/sol/containers/SolCard'
import { SolButton } from '@/lib/sol/inputs/SolButton'
import { SolTextareaInputRaw, SolTextInputRaw } from '@/lib/sol/inputs/SolTextInputRaw'
import { SolTextLink } from '@/lib/sol/inputs/SolTextLink'
import { toast } from '@/lib/sol/overlays/toaster'
import { LoadStateDiv, type RCLoadedDiv } from '@/lib/sol/states/LoadStateDiv'
import { dom } from '@/utils/dom-ext'
import { errLib } from '@/utils/errLib'
import { setAtom } from '@/utils/jotai-ext'
import { emptyObj } from '@/utils/react-ext'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import performLogout from '../login/performLogout'
import { projectListLoader } from './projectListLoader'

type TView =
	| { type: 'edit', item: RouterOutputs['projects']['list'][number] }
	| { type: 'new' }
	| null

export const ProjectsListPage: React.FC = () => {

	const { state } = projectListLoader.useStateWithLoader(emptyObj)
	const isSuperAdmin = useIsSuperAdmin()
	const [view, setView] = useState<TView>(null)

	return <div className='h-screen w-screen max-h-screen max-w-screen min-w-screen min-h-0 flex flex-col items-center justify-center'>
		<SolCard
			border='thin'
			bg='none'
			className='w-[90vw] max-w-[400px] flex flex-col items-center'
		>
			<div className='h-2 shrink-0' />
			<h1 className='text-xl lg:text-2xl dark:text-neutral-100 font-bold mb-8'>
				{ view ? view.type === 'new' ? 'Create project' : 'Edit project' : 'Select project' }
			</h1>

			{
				view === null
					? <>
						<LoadStateDiv
							state={state}
							view={ProjectList}
						/>

						<div className='flex items-center justify-center gap-2'>
							{ isSuperAdmin && <>
								<SolTextLink underline='onhover' className='hover:!decoration-neutral-500/50 !text-sm !text-neutral-500/50 mt-3 mb-1' onClick={() => setView({ type: 'new' })}>New project</SolTextLink>
								<span className='inline-block mt-3 mb-1'>|</span>
							</> }
							<SolTextLink underline='onhover' className='hover:!decoration-neutral-500/50 !text-sm !text-neutral-500/50 mt-3 mb-1' onClick={() => performLogout()}>Sign out</SolTextLink>

						</div>
					</>
					: view.type === 'new'
						? <ProjectCreator setView={setView} />
						: <ProjectEditor
							project={view.item}
							onClose={() => setView(null)}
						/>
			}

		</SolCard>
	</div>
}

const ProjectList: RCLoadedDiv<RouterOutputs['projects']['list']> = ({ data }) => {

	const isALPTeam = useIsDevteam()
	const nav = useNavigate()


	return (
		data.map((project) => (
			<SolCard
				transitionDuration='d75ms'
				border='thin'
				borderColor='neutral_light'
				bg='none'
				style={{ height: isALPTeam ? '60px' : '70px', paddingTop: !isALPTeam ? '3px' : '7px' }}
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

const ProjectCreator: React.FC<{ setView: React.Dispatch<React.SetStateAction<TView>> }> = ({ setView }) => {

	const [nameInput, setNameInput] = useState('')
	const [codename, setCodename] = useState('')
	const [externalName, setExternalName] = useState('')
	const [description, setDescription] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	return <>
		<SolTextInputRaw value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder='Project name' className='w-full mb-3' />
		<SolTextInputRaw value={codename} onChange={(e) => setCodename(e.target.value.toUpperCase())} placeholder='Project codename' className='placeholder:font-sans font-medium font-mono w-full mb-3' />
		<SolTextInputRaw value={externalName} onChange={(e) => setExternalName(e.target.value)} placeholder='Project external name' className='w-full mb-3' />
		<SolTextareaInputRaw value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Project description' className='w-full mb-3' />

		<div className='h-2 shrink-0' />

		<div className='flex items-center justify-center mb-2 gap-2 self-stretch'>
			<SolButton
				theme='neutral_light'
				className='flex-1'
				onClick={() => setView(null)}
			>
				Back
			</SolButton>
			<SolButton
				theme='primary_filled'
				className='w-full flex-2'
				isLoading={isSubmitting}
				onClick={dom.withProgress(
					setIsSubmitting,
					async () => {
						await api.projects.create.mutate({
							name: nameInput,
							codename,
							externalName,
							description: description || undefined
						}).then((result) => setAtom(projectListLoader.immerAtom, (s) => {
							if (!s.loaded) return
							s.data.push(result)
						}))
							.then(() => {
								setView(null)
							})
							.catch((e) => {
								toast('Failed to create project', errLib.logAndExtractError(e))
							})
					}
				)}
			>
				Create project
			</SolButton>
		</div>
	</>
}

const ProjectEditor: React.FC<{ project: RouterOutputs['projects']['list'][number], onClose: () => void }> = ({ project, onClose }) => {
	return (
		<SolCard>
			<h1 className='text-lg lg:text-xl dark:text-neutral-100 font-bold mb-8'>Edit Project</h1>
			{/* Form for editing the project */}
			<label>
				<p>Name</p>
			</label>
		</SolCard>
	)
}
