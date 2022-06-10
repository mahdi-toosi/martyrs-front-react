import { useEffect, useState } from 'react'
import { Routes, useLocation } from 'react-router-dom'
// ? components
import TopBarProgress from 'react-topbar-progress-indicator'

export default function RoutesWithNProgress({ children }: any) {
	const [progress, setProgress] = useState(false)
	const [prevLoc, setPrevLoc] = useState('')
	const location = useLocation()

	useEffect(() => {
		setPrevLoc(location.pathname)
		setProgress(true)
		if (location.pathname === prevLoc) {
			setPrevLoc('')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location])

	useEffect(() => {
		setProgress(false)
	}, [prevLoc])

	TopBarProgress.config({
		barColors: { '0': '#22d7dd', '0.5': '#1baaae', '1.0': '#126f72' },
	})

	return (
		<>
			{progress && <TopBarProgress />}
			<Routes>{children}</Routes>
		</>
	)
}
