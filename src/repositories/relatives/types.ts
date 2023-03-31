import type { Res, Pagination } from '../types'

export interface Relative {
	job: string
	id: number
	name: string
	phone: string
	mobile: string
	alive: boolean
	relation: string
	address: string
	BD_Date: string
	gender: boolean
	martyr_id: string
	education: string
	StatusOfSacrifice: string
}

export interface Relatives extends Pagination {
	data: Relative[]
}

export interface RelativesPayload {
	$limit: number
	$skip: number
}

export interface RRelatives {
	get(payload: RelativesPayload): Res<Relatives>
	create(payload: Relative): Res<Relative>
	update(payload: Relative): Res<Relative>
	delete(id: number): Res
}
