import create from 'zustand'
// ? types
import type { LoginResponse } from '@/repositories/auth/types'
import type { User } from '@/repositories/users/types'
import type { Martyr } from '@/repositories/martyrs/types'
import type { Relative } from '@/repositories/relatives/types'
import type { SingleDocument } from '@/repositories/documents/types'

type Permissions = keyof Martyr | keyof SingleDocument | keyof Relative

interface UserState {
	user?: LoginResponse['user']
	setUser: (user: LoginResponse['user']) => void

	userInfo: User
	setUserInfo: (val: Partial<User>) => void

	hasPermission: (permission: Permissions, section?: 'docs' | 'relatives' | 'martyrs') => boolean
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

	hasPermission: (permission, section) => {
		const limitAccess = get().user?.limitAccess
		if (!limitAccess) return false
		let p: string = permission
		if (section === 'docs') p = `docs_${permission}`
		if (section === 'relatives') p = `rels_${permission}`

		if (limitAccess.includes(p)) return false
		return true
	},
}))

export const roles = { 3: 'نمایه گر', 30: 'بازبین کننده', 1: 'کاربر', 48: 'مدیر' }
