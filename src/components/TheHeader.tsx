// ? react
import { Link } from 'react-router-dom'
import { router } from '@/router'
// ? utils
import tw, { styled } from 'twin.macro'
import userStore, { roles } from '@/stores/user'
// ? components
import Button from '@mui/material/Button'
import { AccountCircleOutlined, EventNote, Logout } from '@mui/icons-material'
// ? assets
import headerImg from '@/assets/images/header-img.png'

export default function TheHeader() {
	const { user } = userStore()

	const logout = () => {
		localStorage.clear()
		sessionStorage.clear()
		router.push('/login')
	}

	const date = () => {
		const now = new Date()
		const option = {
			month: 'numeric',
			day: 'numeric',
			weekday: 'long',
			year: 'numeric',
		} as Intl.DateTimeFormatOptions
		const formatDate = new Intl.DateTimeFormat('fa-IR', option).formatToParts(now)
		const d = {} as { [key: string]: string }
		formatDate.forEach((el) => {
			d[el.type] = el.value
		})
		return `${d.weekday} ${d.year}/${d.month}/${d.day}`
	}

	return (
		<Header>
			<div className="flex items-center">
				<img src={headerImg} alt="تصویر هدر" width="311px" />

				<LinksList>
					<li>
						<Link to="/">
							<Button size="large" className="text-white">
								داشبورد
							</Button>
						</Link>
					</li>
					{user?.role === 48 && (
						<li>
							<Link to="/users">
								<Button size="large" className="text-white">
									کاربران
								</Button>
							</Link>
						</li>
					)}
					<li>
						<Link to="/martyrs">
							<Button size="large" className="text-white">
								شهدا
							</Button>
						</Link>
					</li>
					{user?.role === 48 && (
						<li>
							<Link to="/users/works-report">
								<Button size="large" className="text-white">
									گزارش عملکرد
								</Button>
							</Link>
						</li>
					)}
				</LinksList>
			</div>

			<Ul>
				{user?.id && (
					<li>
						<Link to={`/users/${user.id}`}>
							<Button size="large" startIcon={<AccountCircleOutlined />} className="text-white">
								{roles[user.role]}: {user.name}
							</Button>
						</Link>
					</li>
				)}

				<li>
					<EventNote /> {date()}
				</li>
				<li>
					<Button size="large" startIcon={<Logout />} onClick={logout} className="text-white">
						خروج
					</Button>
				</li>
			</Ul>
		</Header>
	)
}

// ? styles
const Header = styled.header(() => [
	'background-color: #d1aa24;',
	'box-shadow: #d1a9248c 0px 5px 7px 0;',
	tw`flex justify-between items-center rounded-b-xl overflow-hidden text-white`,
	{ button: tw`!border-0` },
])
const LinksList = tw.ul`flex gap-5 mr-5`
const Ul = tw.ul`flex items-center gap-5 ml-5`
