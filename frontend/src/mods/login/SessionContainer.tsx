import { useSession } from '@/lib/session/sessionAtom'
import { Outlet } from 'react-router'

export const SessionContainer: React.FC = () => {

	useSession(true)

	return <>
		<Outlet />
	</>
}
