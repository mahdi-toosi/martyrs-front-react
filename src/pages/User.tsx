// ? react
import { useEffect, useState } from 'react'
import { getRouteQueries } from '@/router'
import { useParams } from 'react-router-dom'
// ? utils
import userStore from '@/stores/user'
import { useRepositories } from '@/repositories'
// ? components
import { BoxLoading } from 'react-loadingg'
import Typography from '@mui/material/Typography'
import UserInfoForm from '@/components/UserInfoForm'
import DefaultLayout from '@/components/DefaultLayout'
// ? type
import UserMartyrsStatistics from '@/components/UserMartyrsStatistics'

export default function User() {
	const { userId } = useParams()
	const queries = getRouteQueries()
	const { users: usersRepo } = useRepositories()

	const { userInfo, setUserInfo } = userStore()
	const [fetchLoading, setFetchLoading] = useState(false)

	const fetchUser = async () => {
		setFetchLoading(true)
		const result = await usersRepo.getById(userId as string)
		setFetchLoading(false)
		if (!result) return

		setUserInfo(result)
	}

	useEffect(() => {
		fetchUser()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (fetchLoading) return <BoxLoading color="#c5a711" />

	return (
		<DefaultLayout>
			<Typography variant="h5">
				مدیریت کاربر {queries.name ? ` | ${userInfo.name || queries.name}` : ''}
			</Typography>

			<UserMartyrsStatistics />

			<UserInfoForm userId={Number(userId)} />
		</DefaultLayout>
	)
}
