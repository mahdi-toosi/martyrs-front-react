import type { Res, Pagination } from '../types'
import type { Martyr as _Martyr } from '../martyrs/types'
import type { Taxonomy, TaxonomyRelation } from '../taxonomies/types'

export type UserRoles = 1 | 3 | 30 | 48

export interface DocumentsPayload {
	$skip: number
	$limit: number
	$select: string[]
	martyr_id: string
	'[title][$like]'?: string
	status?: Document['status']
}

export interface SingleDocument {
	id: string
	title: string
	text: string
	sum: string
	note: string
	code: string
	image?: string
	startDay: string
	createdAt: string
	martyr_id: string
	updatedAt: string
	description: string
	tags?: (TaxonomyRelation | Taxonomy)[]
	taxonomies_relations: TaxonomyRelation[] | Taxonomy
	status: 'notStart' | 'doing' | 'sendForReviewer' | 'done'
}

export type Document = Pick<
	SingleDocument,
	'id' | 'title' | 'sum' | 'code' | 'martyr_id' | 'status'
>

export interface Documents extends Pagination {
	data: Document[]
}

export interface RDocuments {
	get(payload: DocumentsPayload): Res<Documents>
	getById(id: string): Res<SingleDocument>
	update(payload: SingleDocument): Res<SingleDocument>
	uploadImage(id: string, newImg: Blob, p_img?: string): Res
	remove(id: string): Res
}
