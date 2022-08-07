import type { AxiosInstance } from 'axios'
import type { RUsersMartyrs } from './types'
export type { RUsersMartyrs }

const UsersMartyrsService = '/users-martyrs'

export default (axios: AxiosInstance): RUsersMartyrs => ({
	delete(relation_id) {
		return axios.delete(`${UsersMartyrsService}/${relation_id}`)
	},
})
