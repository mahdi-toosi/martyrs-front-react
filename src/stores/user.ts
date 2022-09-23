import create from 'zustand'
import type { LoginResponse } from '@/repositories/auth/types'
import type { User } from '@/repositories/users/types'

interface UserState {
	user?: LoginResponse['user']
	setUser: (user: LoginResponse['user']) => void

	userInfo: User
	setUserInfo: (val: Partial<User>) => void
}

export default create<UserState>((set, get) => ({
	user: localStorage.getItem('user')
		? JSON.parse(localStorage.getItem('user') as string)
		: undefined,

	setUser: (user) => {
		localStorage.setItem('user', JSON.stringify(user))
		set(() => ({ user }))
	},

	userInfo: {} as User, // fetched user for user Page
	setUserInfo: (userInfo) => set(() => ({ userInfo: { ...get().userInfo, ...userInfo } })),
}))

export const roles = { 3: 'نمایه گر', 30: 'بازبین کننده', 1: 'کاربر', 48: 'مدیر' }
