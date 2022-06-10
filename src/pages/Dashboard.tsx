import { Link } from 'react-router-dom'

export default function Dashboard() {
	return (
		<>
			<h1>Dashboard</h1>
			<Link to={'/profile'} className="bg-red-400">
				profile
			</Link>
		</>
	)
}
