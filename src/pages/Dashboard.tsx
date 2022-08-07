// ? utils
import tw, { styled } from 'twin.macro'
import userStore, { roles } from '@/stores/user'
// ? components
import Typography from '@mui/material/Typography'
import DefaultLayout from '@/components/DefaultLayout'
// ? assets
import logo from '@/assets/images/logo-gray.png'

export default function Dashboard() {
	const { user } = userStore()

	return (
		<DefaultLayout>
			<Section>
				<Div>
					<img src={logo} alt="لوگو" />

					<Typography variant="h5" className="text-center">
						سامانه جامع شهدای دیار سربداران
					</Typography>

					<Typography variant="h6" className="text-center mb-5">
						{roles[user?.role as keyof typeof roles]} گرامی {user?.name} ، به سامانه جامع اطلاعات و
						اسناد شهدای دیار سربداران خوش آمدید.
					</Typography>
				</Div>
			</Section>
		</DefaultLayout>
	)
}

// ? styles
const Section = styled.section(() => [
	'height: calc(100vh - 180px);',
	'min-height: 500px;',
	tw`flex justify-center items-center`,
])
const Div = styled.section(() => [
	'min-width: 750px;',
	tw`flex flex-col justify-center items-center gap-5 w-6/12 rounded-xl px-4 py-8
	border-b-2 border-gray-600 text-black bg-white`,
])
