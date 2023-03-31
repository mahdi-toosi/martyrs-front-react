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
	uploadImage(id, avatar, p_avatar) {
		const formData = new FormData()
		formData.append('new_image', avatar)
		return axios.post('/uploadAvatarImage', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
			params: { id, p_avatar },
		})
	},
	delete(id) {
		return axios.delete(`${martyrsService}/${id}`)
	},
})
