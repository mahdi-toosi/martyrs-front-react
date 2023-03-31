/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react'
import axiosInstance from '@/utils/api'
// ? types
import type { AxiosInstance } from 'axios'
import type { Repositories } from './types'
// ? repositories
import auth from './auth'
import users from './users'
import martyrs from './martyrs'
import relatives from './relatives'
import documents from './documents'
import taxonomies from './taxonomies'
import usersMartyrs from './usersMartyrs'

function repositoryContainer(axios: AxiosInstance) {
	return {
		get auth() {
			return lazyBind<Repositories['auth']>(() => import('./auth'), auth(axios), axios)
		},
		get users() {
			return lazyBind<Repositories['users']>(() => import('./users'), users(axios), axios)
		},
		get martyrs() {
			return lazyBind<Repositories['martyrs']>(() => import('./martyrs'), martyrs(axios), axios)
		},
		get relatives() {
			return lazyBind<Repositories['relatives']>(
				() => import('./relatives'),
				relatives(axios),
				axios
			)
		},
		get documents() {
			return lazyBind<Repositories['documents']>(
				() => import('./documents'),
				documents(axios),
				axios
			)
		},
		get taxonomies() {
			return lazyBind<Repositories['taxonomies']>(
				() => import('./taxonomies'),
				taxonomies(axios),
				axios
			)
		},
		get usersMartyrs() {
			return lazyBind<Repositories['usersMartyrs']>(
				() => import('./usersMartyrs'),
				usersMartyrs(axios),
				axios
			)
		},
	}
}

function lazyBind<T>(repoFactory: any, repoInterface: T, axios: AxiosInstance) {
	return {
		...Object.keys(repoInterface as any).reduce((acc, method: any) => {
			const resolvedMethod = async (...args: any[]) => {
				const repo: any = await repoFactory()
				return repo.default(axios)[method](...args)
			}
			return {
				...acc,
				[method]: resolvedMethod,
			}
		}, {}),
	}
}

export const RepositoriesContext = createContext({} as Repositories)
export const useRepositories = () => useContext(RepositoriesContext)
export const repositories = repositoryContainer(axiosInstance) as Repositories
