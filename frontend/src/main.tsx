import { Provider as JotaiProvider } from 'jotai'
import { store as jotaiStore } from './utils/jotai-ext'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'

document.addEventListener('DOMContentLoaded', () => {
	createRoot(document.getElementById('root')!).render(
		<JotaiProvider store={jotaiStore}>
			<App />
		</JotaiProvider>
	)
})
