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
const User = lazy(() => import('@/pages/User'))
const Login = lazy(() => import('@/pages/Login'))
const Users = lazy(() => import('@/pages/Users'))
const Martyr = lazy(() => import('@/pages/Martyr'))
const Import = lazy(() => import('@/pages/Import'))
const Profile = lazy(() => import('@/pages/Profile'))
const Martyrs = lazy(() => import('@/pages/Martyrs'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Document = lazy(() => import('@/pages/Document'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Documents = lazy(() => import('@/pages/Documents'))
const UserWorksReport = lazy(() => import('@/pages/UserWorksReport'))
const UsersWorksReport = lazy(() => import('@/pages/UsersWorksReport'))

function AuthCheck() {
	const location = useLocation()
	const isLoggedIn = sessionStorage.getItem('token')
	const authenticationPages = ['/login']

	if (isLoggedIn && authenticationPages.includes(location.pathname)) return <Navigate to="/" />
	return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}

export const router = createBrowserHistory({ window })

export default function Router() {
	return (
		<HistoryRouter history={router}>
			<Suspense fallback={<BoxLoading color="#c5a711" />}>
				<RoutesWithNProgress>
					<Route element={<AuthCheck />}>
						<Route path="/" element={<Dashboard />} />
						<Route path="/users" element={<Users />} />
						<Route path="/import" element={<Import />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/users/:id" element={<User />} />
						<Route path="/martyrs" element={<Martyrs />} />
						<Route path="/martyrs/:id" element={<Martyr />} />
						<Route path="/documents" element={<Documents />} />
						<Route path="/documents/:id" element={<Document />} />
						<Route path="/users/works-report" element={<UsersWorksReport />} />
						<Route path="/users/:id/works-report" element={<UserWorksReport />} />
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
		// eslint-disable-next-line no-param-reassign
		if (params[key] === undefined) delete params[key]
	}
	const queries = new URLSearchParams(params as Record<string, string>)
	return queries.toString()
}
