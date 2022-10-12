import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { router } from '@/router'
import toast from '@/utils/toast'

const baseURL = import.meta.env?.VITE_BASE_URL

const axiosInstance = axios.create({ baseURL })

function handleRequest(config: AxiosRequestConfig) {
	const token = sessionStorage.getItem('token')
	if (token) {
		// eslint-disable-next-line no-param-reassign
		config.headers!.Authorization = token
	}

	return config
}

function handleResponse(response: AxiosResponse) {
	return response.data
}

axiosInstance.interceptors.request.use(handleRequest)

axiosInstance.interceptors.response.use(handleResponse, (error) => {
	if (!error) return

	if (error.response?.status === 401 && window.location.pathname !== '/login') {
		localStorage.clear()
		sessionStorage.clear()
		router.push('/login')
		return
	}
	if (error.response?.status === 401 && error.response?.data.message === 'Invalid login') {
		toast('نام کاربری یا رمز عبور اشتباه است')
		return
	}

	toast(error.response?.data?.message || error.message)
})

export default axiosInstance
