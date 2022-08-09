import type { User, UserRoles } from '../users/types'
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

export interface LoginResponse {
	accessToken: string
	authentication: {
		strategy: 'local'
		accessToken: string
	}
	user: User
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
