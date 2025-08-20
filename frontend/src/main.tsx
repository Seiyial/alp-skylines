import { Provider as JotaiProvider } from 'jotai'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { Router } from './Router'
import './styles.css'
import { store as jotaiStore } from './utils/jotai-ext'

document.addEventListener('DOMContentLoaded', () => {
	createRoot(document.getElementById('root')!).render(
		<JotaiProvider store={jotaiStore}>
			<Router />
			<Toaster />
		</JotaiProvider>
	)
})
