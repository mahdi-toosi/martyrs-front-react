import type { RAuth } from './auth'
import type { RUsers } from './users'
import type { RMartyrs } from './martyrs'
import type { RRelatives } from './relatives'
import type { RDocuments } from './documents'
import type { RTaxonomies } from './taxonomies'
import type { RUsersMartyrs } from './usersMartyrs'

export interface Repositories {
	auth: RAuth
	users: RUsers
	martyrs: RMartyrs
	relatives: RRelatives
	documents: RDocuments
	taxonomies: RTaxonomies
	usersMartyrs: RUsersMartyrs
}

export interface Pagination {
	limit: number
	skip: number
	total: number
}

export type Res<A = 'success', B = undefined, C = undefined, D = undefined> = Promise<A | B | C | D>
