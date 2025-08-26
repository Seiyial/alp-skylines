import { useSession } from '@/lib/session/sessionAtom'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

export const SessionContainer: React.FC = () => {

	const nav = useNavigate()
	const session = useSession(true)
	const location = useLocation()

	useEffect(() => {
		if (
			session
			&& session.shouldChangePassword
			&& location.pathname !== '/main/change-password'
		) {
			nav('/main/change-password')
		}
	}, [location, session])

	return <>
		<Outlet />
	</>
}
