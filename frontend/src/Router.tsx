import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ChangePasswordPage } from './mods/login/ChangePasswordPage'
import { LoginPage } from './mods/login/LoginPage'
import { SessionContainer } from './mods/login/SessionContainer'
import { ProjectsListPage } from './mods/project-list/ProjectsListPage'
import { ProjectPage } from './mods/project-page/ProjectPage'
import { ProjectReportPage } from './mods/project-report-page/ProjectReportPage'
export const Router: React.FC = () => {

	return <BrowserRouter>
		<AnimatePresence mode='wait'>
			<Routes location={location} key={location.pathname}>
				<Route path='/' element={<LoginPage />} />
				<Route path='/main' element={<SessionContainer />}>
					<Route path='/main/projects' element={<ProjectsListPage />} />
					<Route path='/main/projects/:projectID' element={<ProjectPage />} />
					<Route path='/main/projects/:projectID/report' element={<ProjectReportPage />} />

					<Route path='/main/change-password' element={<ChangePasswordPage />} />
				</Route>
			</Routes>
		</AnimatePresence>
	</BrowserRouter>
}
