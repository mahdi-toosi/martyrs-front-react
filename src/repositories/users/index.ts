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
})
