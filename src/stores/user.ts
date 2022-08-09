import create from 'zustand'
import type { LoginResponse } from '@/repositories/auth/types'

interface UserState {
	user: LoginResponse['user'] | undefined
	setUser: (user: LoginResponse['user']) => void
}

export default create<UserState>((set) => ({
	user: localStorage.getItem('user')
		? JSON.parse(localStorage.getItem('user') as string)
		: undefined,

	setUser: (user) => {
		localStorage.setItem('user', JSON.stringify(user))
		set(() => ({ user }))
	},
}))

export const roles = { 3: 'نمایه گر', 30: 'بازبین کننده', 1: 'کاربر', 48: 'مدیر' }
