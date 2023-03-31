import type { Res, Pagination } from '../types'

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
	get(payload: TaxonomiesPayload): Res<Taxonomies>
	deleteRelation(id: number): Res
}
