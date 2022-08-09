import { Pagination } from '@/repositories'

export type UserRoles = 1 | 3 | 30 | 48

export interface UsersPayload {
	role?: UserRoles
	'name[$like]'?: string
}

interface Martyr_Document {
	id: string
	status: string
	updatedAt: string
}

interface Martyr {
	id: string
	code: string
	name: string
	status: string
	lastName: string
	fatherName: string
	documents: Martyr_Document[]
}

interface Users_Martyrs_Relation {
	start: string
	done: string
	martyr: Martyr[]
	user_id: number
	martyr_id: string
	role_type: number
	relation_id: number
}

export interface User {
	id: number
	base: string
	name: string
	mobile: string
	role: UserRoles
	first_login: string
	limitAccess: string[]
	present_lastDate: string
	users_martyrs: Users_Martyrs_Relation[]
}
export interface Users extends Pagination {
	data: User[]
}

export interface RUsers {
	get(payload: UsersPayload): Promise<Users | undefined>
}
