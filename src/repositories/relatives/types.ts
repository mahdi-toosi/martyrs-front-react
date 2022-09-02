import type { Pagination } from '@/repositories'

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
	get(payload: RelativesPayload): Promise<Relatives | undefined>
	create(payload: Relative): Promise<Relative | undefined>
	update(payload: Relative): Promise<Relative | undefined>
	delete(id: number): Promise<'success' | undefined>
}
