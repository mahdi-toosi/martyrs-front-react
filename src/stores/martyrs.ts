// ? react
import { getRouteQueries, generateRouteQueries, history as router } from '@/router'
// ? utils
import create from 'zustand'
// ? types
import type { User, UserRoles } from '@/repositories/users/types'
import type { UsersMartyr, RUsersMartyrs } from '@/repositories/usersMartyrs/types'
import type { MartyrPaginate, Martyrs, RMartyrs, GetPayload } from '@/repositories/martyrs/types'

interface MartyrsState {
	page: number
	martyrs: Martyrs
	selected: string[]
	fetchLoading: boolean
	detachUserLoading: number

	setPage: (page: number) => void
	setMartyrs: (martyrs: Martyrs) => void
	setSelected: (selected: string[]) => void
	setFetchLoading: (loading: boolean) => void
	setDetachUserLoading: (detachUserLoading: number) => void
	addUserToMartyr: (martyrId: string, user: User, relation_id: number) => void
	clearStore: () => void

	fetchMartyrs: (repo: RMartyrs, page?: number, newRowsPerPage?: number) => void
	detachUser: (usersMartyrs: RUsersMartyrs, um: UsersMartyr, martyrIndex: number) => void
}

export default create<MartyrsState>((set, get) => ({
	page: 0,
	selected: [],
	fetchLoading: false,
	detachUserLoading: 0,
	martyrs: {} as Martyrs,

	// ? mutations
	setPage: (page) => set(() => ({ page })),
	setMartyrs: (martyrs) => set(() => ({ martyrs })),
	setSelected: (selected) => set(() => ({ selected })),
	setFetchLoading: (fetchLoading) => set(() => ({ fetchLoading })),
	setDetachUserLoading: (detachUserLoading) => set(() => ({ detachUserLoading })),
	addUserToMartyr: (martyrId, user, relation_id) => {
		const martyr_index = get().martyrs.data.findIndex((m) => m.id === martyrId)
		if (martyr_index === -1) return
		const um = {
			relation_id,
			role_type: user.role,
			user_id: user.id,
			user: { id: user.id, name: user.name, role: user.role },
		} as UsersMartyr

		get().martyrs.data[martyr_index].users_martyrs.push(um)
	},
	clearStore: async () =>
		set(() => ({
			page: 0,
			selected: [],
			rowsPerPage: 10,
			fetchLoading: false,
			martyrs: {} as Martyrs,
		})),

	// ? actions
	fetchMartyrs: async (martyrsRepo, newPage, newRowsPerPage) => {
		const queries = getRouteQueries()

		const page = newPage === 0 ? 0 : Number(queries.page) || 0
		const rowsPerPage = newRowsPerPage || Number(queries.rowsPerPage) || 10

		const payload = { $select, $limit: rowsPerPage, $skip: page * rowsPerPage } as GetPayload

		if (queries.keyword) {
			payload['$sort[updatedAtManually]'] = 1
			payload['$or[2][code][$like]'] = `%${queries.keyword}%`
			payload['$or[0][name][$like]'] = `%${queries.keyword}%`
			payload['$or[1][lastName][$like]'] = `%${queries.keyword}%`
		}

		get().setFetchLoading(true)
		const result = await martyrsRepo.get(payload)
		get().setFetchLoading(false)
		if (!result) return

		get().setPage(page)
		get().setMartyrs(result)

		const q = { ...queries, page, rowsPerPage, keyword: queries.keyword }
		const _queries = generateRouteQueries(q)
		router.replace(`/martyrs?${_queries}`)
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
