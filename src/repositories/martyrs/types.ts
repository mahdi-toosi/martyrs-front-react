import type { Pagination } from '@/repositories'
import type { Document } from '../documents/types'
import type { UsersMartyr } from '../usersMartyrs/types'
import type { TaxonomyRelation } from '../taxonomies/types'

export interface GetPayload {
	$limit: number
	$skip: number
	$select?: string[]
	'$or[2][code][$like]'?: string
	'$or[0][name][$like]'?: string
	'$or[1][lastName][$like]'?: string
	'$sort[updatedAtManually]'?: 0 | 1
}

export interface Martyr {
	id: string
	job: string
	bio: string
	title: string
	city: string
	will: string
	unit: string
	sect: string
	note: string
	code: string
	state: string
	name: string
	locTo: string
	image: string
	village: string
	status: string
	degree: string
	county: string
	howTo: string
	dateTo: string
	M_Date: string
	N_Code: string
	religion: string
	BD_Date: string
	BC_Code: string
	gender: boolean
	lastName: string
	will_sum: string
	createdAt: string
	education: string
	last_Resp: string
	burial_loc: string
	married: boolean
	dispatcher: string
	updatedAt: string
	sendingUnit: string
	fatherName: string
	burial_piece: string
	operationTO: string
	motherName: string
	originality_city: string
	situationInUnit: string
	Sacrifice_Code: string
	originality_state: string
	originality_county: string
	originality_village: string
	children_num: number
	burial_block: number
	burial_num: number
	burial_city: string
	burial_county: string
	burial_state: string
	burial_village: string
	will_excerpts: string
	DateOfFirstDispatch: string
	ageInFirstDispatch: number
	NumberOfDispatches: number
	totalOfStayingInFront: number
	haveIndexer: boolean
	haveReviewer: boolean
	haveDocs: boolean
	docsStatus: string
	updatedAtManually: string
	users_martyrs: UsersMartyr[]
	taxonomies_relations: TaxonomyRelation[]
	documents: Pick<Document, 'id' | 'status'>[]
	// 👇🏻 added in front

	defaultCity?: { name: string }
	defaultState?: { name: string }
	defaultBurialCity?: { name: string }
	defaultBurialState?: { name: string }
	defaultOriginalityCity?: { name: string }
	defaultOriginalityState?: { name: string }

	tags: TaxonomyRelation[]
	categories: TaxonomyRelation[]
	operations: TaxonomyRelation[]
	defaultTags: TaxonomyRelation[]
	defaultCategories: TaxonomyRelation[]
	defaultOperations: TaxonomyRelation[]
}

export type MartyrPaginate = Pick<
	Martyr,
	| 'id'
	| 'code'
	| 'name'
	| 'status'
	| 'N_Code'
	| 'lastName'
	| 'haveDocs'
	| 'documents'
	| 'docsStatus'
	| 'fatherName'
	| 'haveIndexer'
	| 'users_martyrs'
	| 'updatedAtManually'
>
export interface Martyrs extends Pagination {
	data: MartyrPaginate[]
}

export interface RMartyrs {
	get(payload: GetPayload): Promise<Martyrs | undefined>
	getById(id: string): Promise<Martyr | undefined>
	update(payload: Martyr): Promise<undefined>
	delete(id: string): Promise<'success' | undefined>
}
