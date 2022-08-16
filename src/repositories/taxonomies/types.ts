import type { Pagination } from '@/repositories'

export interface Taxonomy {
	id: number
	name: string
	type: 'tag' | 'category' | 'operation'
}

export interface TaxonomyRelation {
	relation_id: number
	taxonomy?: Taxonomy
}

export interface TaxonomiesPayload {
	'name[$like]': string
	type: Taxonomy['type']
}

export interface Taxonomies extends Pagination {
	data: Taxonomy[]
}

export interface RTaxonomies {
	get(payload: TaxonomiesPayload): Promise<Taxonomies | undefined>
	deleteRelation(id: number): Promise<void>
}
