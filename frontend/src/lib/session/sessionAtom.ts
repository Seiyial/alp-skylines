import { writeAtom } from '@/utils/jotai-ext'
import { emptyObj } from '@/utils/react-ext'
import { atom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../api'
import { toast } from '../sol/overlays/toaster'

export const sessionAtom = atom<null | { id: string, email: string | null, name: string, isSuperAdmin: boolean }>(null)

export const useSession = (expectLoggedIn: boolean = true) => {
	const nav = useNavigate()
	const session = useAtomValue(sessionAtom)
	useEffect(() => {
		if (expectLoggedIn && session === null) {
			api.sessions.getState.query(emptyObj)
				.then((resp) => {
					if (resp) {
						writeAtom(sessionAtom, resp)
					} else {
						toast('Not signed in', 'Please sign in to continue.')
						nav('/')
					}
				})
		}
	}, [session])

	return session
}
