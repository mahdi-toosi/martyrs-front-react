import type { AxiosInstance } from 'axios'
import type { RRelatives } from './types'

export type { RRelatives }

const Service = '/relatives'

export default (axios: AxiosInstance): RRelatives => ({
	get(params) {
		return axios.get(Service, { params })
	},
	create(payload) {
		return axios.post(Service, payload)
	},
	update(payload) {
		return axios.patch(`${Service}/${payload.id}`, payload)
	},
	delete(id) {
		return axios.delete(`${Service}/${id}`)
	},
})
