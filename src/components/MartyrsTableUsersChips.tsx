// ? utils
import userStore from '@/stores/user'
import martyrsStore from '@/stores/martyrs'
import { useRepositories } from '@/repositories'
// ? components
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
// ? types
import type { UsersMartyr } from '@/repositories/usersMartyrs/types'

interface Props {
	martyrIndex: number
	type: 'reviewer' | 'indexer'
	usersMartyrs: UsersMartyr[]
}
export default function MartyrsTableUsersChips({ usersMartyrs, type, martyrIndex }: Props) {
	const { usersMartyrs: usersMartyrsRepo } = useRepositories()
	const { user } = userStore()

	const { detachUserLoading, detachUser } = martyrsStore()
	const filteredUsers = usersMartyrs.filter((um) => um.role_type === (type === 'reviewer' ? 30 : 3))

	const onDelete = (um: UsersMartyr) =>
		user?.role === 48 ? () => detachUser(usersMartyrsRepo, um, martyrIndex) : undefined

	return (
		<div className="flex flex-wrap gap-1">
			{filteredUsers.map((um) => (
				<Chip
					key={um.relation_id}
					label={um.user.name}
					variant="outlined"
					color={um.user.role === 1 ? 'error' : 'default'}
					deleteIcon={
						detachUserLoading === um.relation_id ? (
							<CircularProgress color="inherit" className="w-6 h-6" />
						) : (
							<HighlightOffIcon />
						)
					}
					onDelete={onDelete(um)}
				/>
			))}
		</div>
	)
}
