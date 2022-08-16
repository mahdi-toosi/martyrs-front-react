import type { AxiosInstance } from 'axios'
import type { RDocuments } from './types'
export type { RDocuments }

const DocumentsService = '/documents'

export default (axios: AxiosInstance): RDocuments => ({
	get(params) {
		return axios.get(DocumentsService, { params })
	},
	getById(id) {
		return axios.get(`${DocumentsService}/${id}`)
	},
	update(document) {
		return axios.patch(`${DocumentsService}/${document.id}`, document)
	},
	uploadImage(id, newImg, p_img) {
		const formData = new FormData()
		formData.append('new_image', newImg)

		return axios.post('/uploadDocumentImage', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
			params: { id, p_img },
		})
	},
	remove(id) {
		return axios.delete(`${DocumentsService}/${id}`)
	},
})
