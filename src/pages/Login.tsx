import { Link } from 'react-router-dom'

export default function Dashboard() {
	return (
		<>
			<h1>Login Page</h1>
			<Link to={'/'} className="bg-red-400">
				Home
			</Link>
		</>
	)
}
