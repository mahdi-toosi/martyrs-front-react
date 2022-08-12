import type { Pagination } from '@/repositories'
import type { Martyr as _Martyr } from '../martyrs/types'

export type UserRoles = 1 | 3 | 30 | 48

export interface DocumentsPayload {
	$skip: number
	$limit: number
	$select: string[]
	martyr_id: string
	'[title][$like]'?: string
	status?: Document['status']
}

export interface Document {
	id: string
	title: string
	sum: string
	code: string
	martyr_id: string
	status: 'notStart' | 'doing' | 'sendForReviewer' | 'done'
}
export interface Documents extends Pagination {
	data: Document[]
}

export interface RDocuments {
	get(payload: DocumentsPayload): Promise<Documents | undefined>
	remove(id: string): Promise<void | undefined>
}
