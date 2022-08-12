import type { AxiosInstance } from 'axios'
import type { RDocuments } from './types'
export type { RDocuments }

const DocumentsService = '/documents'

export default (axios: AxiosInstance): RDocuments => ({
	get(params) {
		return axios.get(DocumentsService, { params })
	},
	remove(id) {
		return axios.delete(`${DocumentsService}/${id}`)
	},
})
