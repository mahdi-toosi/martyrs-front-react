// ? react
import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
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

export default function Router() {
	return (
		<BrowserRouter>
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
		</BrowserRouter>
	)
}
