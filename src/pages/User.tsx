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
import DefaultLayout from '@/components/DefaultLayout'
// ? type
import type { User as UserType } from '@/repositories/users/types'
import UserMartyrsStatistics from '@/components/UserMartyrsStatistics'

export default function User() {
	const { id } = useParams()
	const queries = getRouteQueries()
	const { user: storedUser } = userStore()
	const { users: usersRepo } = useRepositories()

	const [user, setUser] = useState({} as UserType)
	const [fetchLoading, setFetchLoading] = useState(false)
	const [storeLoading, setStoreLoading] = useState(false)

	const fetchUser = async () => {
		setFetchLoading(true)
		const result = await usersRepo.getById(id as string)
		setFetchLoading(false)
		if (!result) return

		setUser(result)
	}

	useEffect(() => {
		fetchUser()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (fetchLoading) return <BoxLoading color="#c5a711" />

	return (
		<DefaultLayout>
			<Typography variant="h5">مدیریت کاربر {queries.name ? ' | ' + queries.name : ''}</Typography>

			<UserMartyrsStatistics user_martyrs={user.users_martyrs} />
		</DefaultLayout>
	)
}
