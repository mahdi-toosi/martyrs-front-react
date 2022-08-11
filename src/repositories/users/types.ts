import type { Pagination } from '@/repositories'
import type { Martyr as _Martyr } from '../martyrs/types'

export type UserRoles = 1 | 3 | 30 | 48

export interface UsersPayload {
	role?: UserRoles
	'$or[0][name][$like]'?: string
	'$or[1][mobile][$like]'?: string
	'$sort[present_lastDate]'?: -1
}

type Martyr = Pick<
	_Martyr,
	'id' | 'code' | 'name' | 'status' | 'lastName' | 'fatherName' | 'documents'
>

export interface Users_Martyrs_Relation {
	start: string
	done: string
	martyr: Martyr
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
