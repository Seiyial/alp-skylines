import { useState } from 'react'

export const App: React.FC = () => {

	const [count, setCount] = useState(0)

	return <div className='min-h-screen max-h-screen bg-gradient-to-b from-teal-200 to-sky-300 flex flex-col items-center justify-center'>
		<div className='text-center select-none hover:underline cursor-pointer' onClick={() => setCount(count + 1)}>
			Hello world { count }
		</div>
	</div>
}
