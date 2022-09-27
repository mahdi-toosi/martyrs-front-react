import type { AxiosInstance } from 'axios'
import type { RUsers } from './types'

export type { RUsers }

const UsersService = '/users'

export default (axios: AxiosInstance): RUsers => ({
	get(params) {
		return axios.get(UsersService, { params })
	},
	getById(id) {
		return axios.get(`${UsersService}/${id}`)
	},
	update(payload) {
		return axios.patch(`${UsersService}/${payload.id}`, payload)
	},
	delete(id) {
		return axios.delete(`${UsersService}/${id}`)
	},

	getWorksReport(params) {
		return axios.get('usersWorkingReport', { params })
	},
})
