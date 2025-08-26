import { api } from '@/lib/api'
import { sessionAtom } from '@/lib/session/sessionAtom'
import { SolCard } from '@/lib/sol/containers/SolCard'
import { SolButton } from '@/lib/sol/inputs/SolButton'
import { SolTextInputRaw } from '@/lib/sol/inputs/SolTextInputRaw'
import { SolTextLink } from '@/lib/sol/inputs/SolTextLink'
import { toast } from '@/lib/sol/overlays/toaster'
import { ErrorDiv } from '@/lib/sol/states/errors/ErrorDiv'
import { errLib } from '@/utils/errLib'
import { setAtom } from '@/utils/jotai-ext'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import performLogout from './performLogout'

export const ChangePasswordPage: React.FC = () => {

	const [error, setError] = useState<string | null>(null)
	const nav = useNavigate()

	const perfSubmit = () => {
		const existingPw = document.getElementById('existing-password') as HTMLInputElement
		const newPw = document.getElementById('new-password') as HTMLInputElement
		const confirmPw = document.getElementById('confirm-password') as HTMLInputElement

		if (existingPw.value && newPw.value && confirmPw.value) {
			if (newPw.value !== confirmPw.value) {
				setError('New passwords do not match.')
				return
			}
			if (newPw.value === existingPw.value) {
				setError('New password must be different from existing password.')
				return
			}
			if (newPw.value.length < 12) {
				setError('New password must be at least 12 characters long.')
				return
			}
			return api.sessions.repass.mutate({
				nwpwdd: newPw.value,
				oldpwdd: existingPw.value
			}).then((state) => {
				setAtom(sessionAtom, state)
				toast('Password changed', 'Thank you!')
				nav('/main/projects')
			})
				.catch((e) => {
					setError('Failed to change password:\n' + errLib.logAndExtractError(e))
				})
		} else {
			setError('Please fill in all fields.')
		}
	}

	return <div className='h-screen w-screen max-h-screen max-w-screen min-w-screen min-h-0 flex flex-col items-center justify-center'>
		<SolCard bg='base_darker' className='max-w-sm w-[90vw] !py-4 !px-6'>

			<div className='text-xl mb-2 font-semibold'>Welcome!</div>
			<p className='text-sm'>For your security, please enter a new password. Please use at least 12 characters.</p>

			<div className='h-4 shrink-0' />

			<div className='flex flex-col py-2'>

				<label className='block pb-1 text-neutral-500 text-sm text-center' htmlFor='existing-password'>Existing password</label>
				<SolTextInputRaw id='existing-password' name='existing-password' type='password' className='' />

				<div className='h-4 shrink-0' />

				<label className='block pb-1 text-neutral-500 text-sm text-center' htmlFor='new-password'>New password</label>
				<SolTextInputRaw id='new-password' name='new-password' type='password' className='' />

				<div className='h-4 shrink-0' />

				<label className='block pb-1 text-neutral-500 text-sm text-center' htmlFor='confirm-password'>Confirm new password</label>
				<SolTextInputRaw id='confirm-password' name='confirm-password' type='password' onKeyDown={({ key }) => key === 'Enter' && perfSubmit()} />

				<div className='h-6 shrink-0' />
				<ErrorDiv err={error} />
				<div className='h-2 shrink-0' />
				<SolButton theme='primary_filled' onClick={perfSubmit}>Change Password</SolButton>

				<div className='h-1 shrink-0' />

				<p className='flex items-center flex-col justify-center pt-2 gap-2'>
					{/* <SolTextLink className='text-sm' underline='thick' onClick={() => perfSkipPasswordChange()}>I don't wish to change my password</SolTextLink> */}

					<SolTextLink className='text-sm' underline='thick' onClick={() => performLogout()}>Sign out</SolTextLink>
				</p>
			</div>

		</SolCard>
	</div>
}

