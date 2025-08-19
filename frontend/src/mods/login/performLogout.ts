import { api } from '@/lib/api'


const performLogout = () => {
	localStorage.clear()
	api.sessions.logout.mutate().catch((e) => console.error(e))
	window.location.href = '/'
}

export default performLogout
