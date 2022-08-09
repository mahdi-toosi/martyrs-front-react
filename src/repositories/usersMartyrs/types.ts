import type { UserRoles } from '../users/types'

export interface UsersMartyr {
	relation_id: number
	role_type: 3 | 30
	user_id: number
	user: {
		id: number
		name: string
		role: UserRoles
	}
}

export interface AddAccessibilityPayload {
	role_type: 3 | 30
	user_id: number
	martyr_id: string
}

export interface RUsersMartyrs {
	post(payload: AddAccessibilityPayload): Promise<{ id: number } | undefined>
	delete(relation_id: number): Promise<'success' | undefined>
}
