import { api } from '@/lib/api'
import { sessionAtom } from '@/lib/session/sessionAtom'
import { SolButton } from '@/lib/sol/inputs/SolButton'
import { SolTextInputRaw } from '@/lib/sol/inputs/SolTextInputRaw'
import { SolTextLink } from '@/lib/sol/inputs/SolTextLink'
import { ErrorDiv } from '@/lib/sol/states/errors/ErrorDiv'
import useError from '@/lib/sol/states/errors/useError'
import { writeAtom } from '@/utils/jotai-ext'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export const LoginPage: React.FC = () => {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [error, setError] = useError(null)

	const nav = useNavigate()
	const currentUser = useAtomValue(sessionAtom)
	useEffect(() => {
		if (currentUser) nav('/main')
	}, [])

	const perfLogin = async () => {
		setError(null)
		if (!email.trim() || !password.trim()) {
			setError('Please enter your email and password.')
			return
		}
		api.sessions.login.mutate({
			email,
			password
		}).then((res) => {
			writeAtom(sessionAtom, res)
		})
			.catch((e) => {
				setError('Login failed. Please try again. (' + e.message?.toString() + ')')
			})
	}

	return <div className='h-screen w-screen max-h-screen max-w-screen min-w-screen min-h-0 flex flex-col items-center justify-center'>
		<h1 className='text-4xl dark:text-neutral-100 font-bold mb-8'>Login</h1>
		<form action='#' className='flex w-[90vw] max-w-[300px] flex-col gap-2 items-center'>

			<SolTextInputRaw
				type='email'
				placeholder='Email'
				value={email}
				autoCorrect='off'
				className='w-full'
				onChange={(e) => setEmail(e.target.value)}
				onKeyDown={({ key }) => key === 'Enter' && perfLogin()}
			/>

			<SolTextInputRaw
				type='password'
				placeholder='Password'
				value={password}
				autoCorrect='off'
				className='w-full'
				onChange={(e) => setPassword(e.target.value)}
				onKeyDown={({ key }) => key === 'Enter' && perfLogin()}
			/>

			<div className='h-4 shrink-0' />

			<ErrorDiv className='text-center' err={error} />

			<SolButton onClick={perfLogin} className='w-full max-w-[180px]'>
				Sign in
			</SolButton>

			<div />

			<SolTextLink
				underline='onhover'
				className='text-xs'
			>
				Forgot password?
			</SolTextLink>

			<SolTextLink
				underline='onhover'
				className='text-xs'
			>
				Request access
			</SolTextLink>
		</form>
	</div>
}
