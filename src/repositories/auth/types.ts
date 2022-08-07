// export interface RegisterPayload {
// 	first_name: string
// 	last_name: string
// }

// export interface User extends RegisterPayload {
// 	id: number
// }

// export interface AuthResponse {
// 	access_token: string
// 	user: User
// }

// export interface ResetPassPayload {
// 	mobile: string
// 	activation_code: string
// 	password: string
// 	password_confirmation: string
// }

interface Martyr_Document {
	id: string
	status: string
	updatedAt: string
}

interface Martyr {
	id: string
	name: string
	lastName: string
	fatherName: string
	status: string
	code: string
	documents: Martyr_Document[]
}

interface Users_Martyrs_Relation {
	relation_id: number
	martyr_id: string
	role_type: number
	user_id: number
	start: string
	done: string
	martyr: Martyr[]
}

export type UserRoles = 1 | 3 | 30 | 48

export interface LoginResponse {
	accessToken: string
	authentication: {
		strategy: 'local'
		accessToken: string
	}
	user: {
		id: number
		name: string
		mobile: string
		base: string
		role: UserRoles
		limitAccess: string[]
		first_login: string
		present_lastDate: string
		users_martyrs: Users_Martyrs_Relation[]
	}
}

export interface LoginPayload {
	mobile: string
	strategy: 'local'
	password: string
}

export interface RAuth {
	login(payload: LoginPayload): Promise<LoginResponse | undefined>
	// register(payload: RegisterPayload): Promise<AuthResponse>
	// resetPass(payload: ResetPassPayload): Promise<string>
}
