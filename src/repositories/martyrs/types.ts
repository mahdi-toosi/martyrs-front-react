import type { Pagination } from '@/repositories'
import type { UsersMartyr } from '../usersMartyrs/types'

interface GetPayload {
	$limit: number
	$skip: number
	$select?: string[]
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
	documents: Document[]
	users_martyrs: UsersMartyr[]
	taxonomies_relations: TaxonomiesRelation[]
}

export interface Document {
	id: string
	status: 'notStart' | 'doing' | 'sendForReviewer' | 'done'
}

export interface TaxonomiesRelation {
	relation_id: number
	taxonomy: Taxonomy
}

export interface Taxonomy {
	id: number
	name: string
	type: string
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
	delete(id: string): Promise<'success' | undefined>
}
