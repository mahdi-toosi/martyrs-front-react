/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react'
import axios from '@/utils/api'
// ? types
import type { AxiosInstance } from 'axios'
// ? repositories
import auth, { RAuth } from './auth'
import users, { RUsers } from './users'
import martyrs, { RMartyrs } from './martyrs'
import relatives, { RRelatives } from './relatives'
import documents, { RDocuments } from './documents'
import taxonomies, { RTaxonomies } from './taxonomies'
import usersMartyrs, { RUsersMartyrs } from './usersMartyrs'

interface Repositories {
	auth: RAuth
	users: RUsers
	martyrs: RMartyrs
	relatives: RRelatives
	documents: RDocuments
	taxonomies: RTaxonomies
	usersMartyrs: RUsersMartyrs
}

export interface Pagination {
	limit: number
	skip: number
	total: number
}

function repositoryContainer(axios: AxiosInstance) {
	return {
		get auth() {
			return lazyBind<RAuth>(() => import('./auth'), auth(axios), axios)
		},
		get users() {
			return lazyBind<RUsers>(() => import('./users'), users(axios), axios)
		},
		get martyrs() {
			return lazyBind<RMartyrs>(() => import('./martyrs'), martyrs(axios), axios)
		},
		get relatives() {
			return lazyBind<RRelatives>(() => import('./relatives'), relatives(axios), axios)
		},
		get documents() {
			return lazyBind<RDocuments>(() => import('./documents'), documents(axios), axios)
		},
		get taxonomies() {
			return lazyBind<RTaxonomies>(() => import('./taxonomies'), taxonomies(axios), axios)
		},
		get usersMartyrs() {
			return lazyBind<RUsersMartyrs>(() => import('./usersMartyrs'), usersMartyrs(axios), axios)
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
