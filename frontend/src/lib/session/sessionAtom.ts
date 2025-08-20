import { writeAtom } from '@/utils/jotai-ext'
import { emptyObj } from '@/utils/react-ext'
import { atom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
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
						console.log('has session')
						writeAtom(sessionAtom, resp)
					} else {
						console.log('no session')
						toast('Not signed in', 'Please sign in to continue.')
						nav('/')
					}
				})
		}
		console.log('session changed to', session)
	}, [session])

	return session
}

export const useCanUserWrite = () => {
	const session = useAtomValue(sessionAtom)
	const loc = useLocation()
	if (loc.pathname.endsWith('/report')) return false
	return Boolean(session?.isSuperAdmin)
}
export const useIsDevteam = () => {
	const session = useAtomValue(sessionAtom)
	return Boolean(session?.isSuperAdmin)
}
