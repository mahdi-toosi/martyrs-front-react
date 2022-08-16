import type { AxiosInstance } from 'axios'
import type { RTaxonomies } from './types'
export type { RTaxonomies }

const TaxonomiesService = '/taxonomies'
const TaxonomiesRelationsService = '/taxonomies-relations'

export default (axios: AxiosInstance): RTaxonomies => ({
	get(params) {
		return axios.get(TaxonomiesService, { params })
	},
	deleteRelation(id) {
		return axios.delete(`${TaxonomiesRelationsService}/${id}`)
	},
})
