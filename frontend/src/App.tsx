import { useState } from 'react'
import { ProjectHeader } from './mods/project-header/ProjectHeader'

export const App: React.FC = () => {

	const [count, setCount] = useState(0)

	return <div className='min-h-screen max-h-screen bg-gradient-to-b from-teal-200 to-sky-300 flex flex-col items-stretch justify-start'>

		<ProjectHeader />
	</div>
}
