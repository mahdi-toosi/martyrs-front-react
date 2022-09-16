import type { AxiosInstance } from 'axios'
import type { RAuth } from './types'

export type { RAuth }

const loginService = '/authentication'

export default (axios: AxiosInstance): RAuth => ({
	login(payload) {
		return axios.post(loginService, payload)
	},
	// register(payload) {
	// 	return axios.post(`/register`, payload)
	// },
	// resetPass(payload) {
	// 	return axios.post(`/reset-password`, payload)
	// },
})
