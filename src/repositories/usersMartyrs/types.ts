import type { Pagination } from '@/repositories'
import type { UserRoles } from '../auth/types'

export interface UsersMartyr {
	relation_id: number
	role_type: number
	user_id: number
	user: {
		id: number
		name: string
		role: UserRoles
	}
}

export interface RUsersMartyrs {
	delete(relation_id: number): Promise<'success' | undefined>
}
