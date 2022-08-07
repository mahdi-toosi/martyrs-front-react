import create from 'zustand'
import type { LoginResponse } from '@/repositories/auth/types'

interface UserState {
	user: LoginResponse['user'] | undefined
	setUser: (user: LoginResponse['user']) => void
}

export default create<UserState>((set) => ({
	user: undefined,

	setUser: (user) => set((state) => ({ ...state, user })),
}))

export const roles = { 3: 'نمایه گر', 30: 'بازبین کننده', 1: 'کاربر', 48: 'مدیر' }
