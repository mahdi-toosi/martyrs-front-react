import type { AxiosInstance } from 'axios'
import type { RMartyrs } from './types'
export type { RMartyrs }

const martyrsService = '/martyrs'

export default (axios: AxiosInstance): RMartyrs => ({
	get(params) {
		return axios.get(martyrsService, { params })
	},
	delete(id) {
		return axios.delete(`${martyrsService}/${id}`)
	},
})
