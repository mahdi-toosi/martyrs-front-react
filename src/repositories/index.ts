/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react'
import axios from '@/utils/api'
// ? types
import type { AxiosInstance } from 'axios'
// ? repositories
import auth, { RAuth } from './auth'

interface Repositories {
	auth: RAuth
}

function repositoryContainer(axios: AxiosInstance) {
	return {
		get auth() {
			return lazyBind<RAuth>(() => import('./auth'), auth(axios), axios)
		},
	}
}

function lazyBind<T>(repoFactory: any, repoInterface: T, axios: AxiosInstance) {
	return {
		...Object.keys(repoInterface).reduce((acc, method: any) => {
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
export const repositories = repositoryContainer(axios) as Repositories
