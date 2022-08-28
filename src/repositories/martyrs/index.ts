import type { AxiosInstance } from 'axios'
import type { RMartyrs } from './types'
export type { RMartyrs }

const martyrsService = '/martyrs'

export default (axios: AxiosInstance): RMartyrs => ({
	get(params) {
		return axios.get(martyrsService, { params })
	},
	getById(id) {
		return axios.get(`${martyrsService}/${id}`)
	},
	update(payload) {
		return axios.patch(`${martyrsService}/${payload.id}`, payload)
	},
	delete(id) {
		return axios.delete(`${martyrsService}/${id}`)
	},
})
