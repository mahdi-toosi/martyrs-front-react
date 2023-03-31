import type { Res } from '../types'
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
	post(payload: AddAccessibilityPayload): Res<{ id: number }>
	delete(relation_id: number): Res
}
