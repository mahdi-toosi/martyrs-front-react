import create from 'zustand'
import type { MartyrPaginate, Martyrs, RMartyrs, UsersMartyr } from '@/repositories/martyrs/types'
import { RUsersMartyrs } from '@/repositories/usersMartyrs'
import { UserRoles } from '@/repositories/auth/types'

interface MartyrsState {
	martyrs: Martyrs
	page: number
	rowsPerPage: number
	fetchLoading: boolean
	detachUserLoading: number

	setMartyrs: (martyrs: Martyrs) => void
	setPage: (page: number) => void
	setFetchLoading: (loading: boolean) => void
	setRowsPerPage: (rowsPerPage: number) => void
	setDetachUserLoading: (detachUserLoading: number) => void
	clearStore: () => void

	fetchMartyrs: (repo: RMartyrs, page: number) => void
	detachUser: (usersMartyrs: RUsersMartyrs, um: UsersMartyr, martyrIndex: number) => void
}

export default create<MartyrsState>((set, get) => ({
	page: 0,
	rowsPerPage: 10,
	fetchLoading: false,
	detachUserLoading: 0,
	martyrs: {} as Martyrs,

	// ? mutations
	setPage: (page) => set(() => ({ page })),
	setMartyrs: (martyrs) => set(() => ({ martyrs })),
	setFetchLoading: (fetchLoading) => set(() => ({ fetchLoading })),
	setRowsPerPage: (rowsPerPage) => set(() => ({ rowsPerPage })),
	setDetachUserLoading: (detachUserLoading) => set(() => ({ detachUserLoading })),
	clearStore: async () =>
		set(() => ({ martyrs: {} as Martyrs, page: 0, rowsPerPage: 10, fetchLoading: false })),

	// ? actions
	fetchMartyrs: async (martyrsRepo, newPage = 0) => {
		get().setPage(newPage)

		const payload = {
			$select,
			$limit: get().rowsPerPage,
			$skip: newPage * get().rowsPerPage,
		}

		get().setFetchLoading(true)
		const result = await martyrsRepo.get(payload)
		get().setFetchLoading(false)
		if (result) get().setMartyrs(result)
	},

	detachUser: async (usersMartyrs, um, martyrIndex) => {
		const sure = confirm('مطمئنید میخواهید دسترسی این کاربر را محدود کنید ؟')
		if (!sure) return

		get().setDetachUserLoading(um.relation_id)
		const result = await usersMartyrs.delete(um.relation_id)
		get().setDetachUserLoading(0)
		if (!result) return
		const martyr = get().martyrs.data[martyrIndex]
		martyr.users_martyrs = martyr.users_martyrs.filter((u_m) => u_m.relation_id !== um.relation_id)
	},
}))

const $select = [
	'id',
	'code',
	'name',
	'status',
	'N_Code',
	'lastName',
	'haveDocs',
	'docsStatus',
	'fatherName',
	'haveIndexer',
	'updatedAtManually',
]

interface Column {
	key: keyof MartyrPaginate | string
	label: string
	align?: 'center'
	format?: (value: MartyrPaginate) => string
}
export const columns = (userRole?: UserRoles): Column[] => {
	const arr = [
		{ key: 'checkbox', label: '', align: 'center' },
		{ key: 'index', label: 'ردیف', align: 'center' },
		{ key: 'name', label: 'شهید' },
		{ key: 'code', label: 'شماره پرونده' },
		{ key: 'reviewer', label: 'بازبین کننده' },
		{ key: 'indexer', label: 'نمایه گر' },
		{ key: 'allDocs', label: 'تعداد اسناد', align: 'center' },
		{ key: 'doingStatus', label: 'در حال انجام', align: 'center' },
		{ key: 'sendForReviewerStatus', label: 'ارسال شده برای بازبین', align: 'center' },
		{ key: 'doneStatus', label: 'تایید شده', align: 'center' },
		{ key: 'operations', label: 'عملیات', align: 'center' },
	] as Column[]

	if (userRole === 3) return arr.filter((c) => !['reviewer', 'indexer'].includes(c.key))
	if (userRole === 30) return arr.filter((c) => !['reviewer'].includes(c.key))

	return arr
}
