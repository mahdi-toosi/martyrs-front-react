import type { Pagination } from '@/repositories'
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
	get(payload: DocumentsPayload): Promise<Documents | undefined>
	getById(id: string): Promise<SingleDocument | undefined>
	update(payload: SingleDocument): Promise<SingleDocument | undefined>
	uploadImage(id: string, newImg: Blob, p_img?: string): Promise<void>
	remove(id: string): Promise<void | undefined>
}
