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
const User = lazy(() => import('@/pages/User'))
const Users = lazy(() => import('@/pages/Users'))
const Martyr = lazy(() => import('@/pages/Martyr'))
const Profile = lazy(() => import('@/pages/Profile'))
const Martyrs = lazy(() => import('@/pages/Martyrs'))
const Document = lazy(() => import('@/pages/Document'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Documents = lazy(() => import('@/pages/Documents'))

const AuthCheck = () => {
	const location = useLocation()
	const isLoggedIn = sessionStorage.getItem('token')
	const authenticationPages = ['/login']

	if (isLoggedIn && authenticationPages.includes(location.pathname)) return <Navigate to="/" />
	return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}

export const history = createBrowserHistory({ window })

export default function Router() {
	return (
		<HistoryRouter history={history}>
			<Suspense fallback={<BoxLoading color="#c5a711" />}>
				<RoutesWithNProgress>
					<Route element={<AuthCheck />}>
						<Route path="/" element={<Dashboard />} />
						<Route path="/users" element={<Users />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/users/:id" element={<User />} />
						<Route path="/martyrs" element={<Martyrs />} />
						<Route path="/martyrs/:id" element={<Martyr />} />
						<Route path="/documents" element={<Documents />} />
						<Route path="/documents/:id" element={<Document />} />
					</Route>

					<Route path="/login" element={<Login />} />
					<Route path="*" element={<NotFound />} />
				</RoutesWithNProgress>
			</Suspense>
		</HistoryRouter>
	)
}

export const getRouteQueries = () =>
	Object.fromEntries(new URLSearchParams(window.location.search).entries())

export const generateRouteQueries = (params: Record<string, string | number | undefined>) => {
	for (const key in params) {
		if (params[key] === undefined) delete params[key]
	}
	const queries = new URLSearchParams(params as Record<string, string>)
	return queries.toString()
}
