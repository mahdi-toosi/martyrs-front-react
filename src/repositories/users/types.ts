import type { Res, Pagination } from '../types'
import type { Martyr as _Martyr } from '../martyrs/types'

export type UserRoles = 1 | 3 | 30 | 48

export interface UsersPayload {
	role?: UserRoles
	'name[$like]'?: string
	'$or[0][name][$like]'?: string
	'$or[1][mobile][$like]'?: string
	'$sort[present_lastDate]'?: -1
}

type Martyr = Pick<
	_Martyr,
	'id' | 'code' | 'name' | 'status' | 'lastName' | 'fatherName' | 'documents'
>

export interface UsersMartyrsRelation {
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
	password?: string
	limitAccess: string[]
	present_lastDate: string
	showPassword?: boolean
	users_martyrs: UsersMartyrsRelation[]
}

export interface Users extends Pagination {
	data: User[]
}

export interface GetUsersWorksReportPayload {
	id: number
	role?: number
	$skip?: number
	$limit?: number
	end_time: string
	start_time: string
	'$sort[start_time]'?: 1 | -1
}

export interface WorksReport {
	id: number
	report: string
	end_time: string
	start_time: string
	sum_sec: number
	sum_min: number
}

export interface UserWithWorksReport {
	id: number
	name: string
	role: number
	present_lastDate: string
	working_reports: WorksReport[]
	// added in front
	sum_min?: number
	sum_hour?: number
	countDocs?: number
	group_reports: {
		date: string
		sec: number
		min: number
		countDocs: number
		data: WorksReport[]
	}[]
}

export interface UsersWithWorksReport extends Pagination {
	data: UserWithWorksReport[]
}

export interface RUsers {
	get(payload: UsersPayload): Res<Users>
	getById(id: string): Res<User>
	update(payload: User): Res<User>
	delete(id: number): Res

	getWorksReport(payload: GetUsersWorksReportPayload): Res<UsersWithWorksReport>
}
