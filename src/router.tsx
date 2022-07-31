// ? react
import { Suspense, lazy } from 'react'
import {
	Route,
	Outlet,
	Navigate,
	useLocation,
	unstable_HistoryRouter as HistoryRouter,
} from 'react-router-dom'
import { createBrowserHistory } from 'history'
// ? components
import { BoxLoading } from 'react-loadingg'
import RoutesWithNProgress from '@/components/RoutesWithNProgress'
// ? Pages
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
const Profile = lazy(() => import('@/pages/Profile'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))

const AuthCheck = () => {
	const location = useLocation()
	const isLoggedIn = localStorage.getItem('token')
	const authenticationPages = ['/login', '/register']

	if (isLoggedIn && authenticationPages.includes(location.pathname)) return <Navigate to="/" />
	return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}

export const history = createBrowserHistory({ window })

export default function Router() {
	return (
		<HistoryRouter history={history}>
			<Suspense fallback={<BoxLoading />}>
				<RoutesWithNProgress>
					<Route element={<AuthCheck />}>
						<Route path="/" element={<Dashboard />} />
						<Route path="/profile" element={<Profile />} />
					</Route>

					<Route path="/login" element={<Login />} />
					<Route path="*" element={<NotFound />} />
				</RoutesWithNProgress>
			</Suspense>
		</HistoryRouter>
	)
}