// ? react
import { FormEvent, useState } from 'react'
import { getRouteQueries, router, generateRouteQueries } from '@/router'
// ? utils
import tw, { styled } from 'twin.macro'
import martyrsStores from '@/stores/martyrs'
import { useRepositories } from '@/repositories'
// ? components
import { LoadingButton } from '@mui/lab'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import AppDialog from '@/components/AppDialog'
import Typography from '@mui/material/Typography'
import MartyrsTable from '@/components/MartyrsTable'
import DefaultLayout from '@/components/DefaultLayout'
import AppAutoComplete from '@/components/AppAutoComplete'
// ? types
import type { User } from '@/repositories/users/types'
import type { AddAccessibilityPayload } from '@/repositories/usersMartyrs/types'

export default function Martyrs() {
	const { martyrs: martyrsRepo, users, usersMartyrs } = useRepositories()
	const { fetchMartyrs, martyrs, fetchLoading, selected, setSelected, addUserToMartyr } =
		martyrsStores()

	const [visible, setVisible] = useState(false)
	const [viewersOptions, setViewersOptions] = useState([] as User[])
	const [indexersOptions, setIndexersOptions] = useState([] as User[])

	const [viewersValues, setViewersValues] = useState([] as User[])
	const [indexersValues, setIndexersValues] = useState([] as User[])

	const [fetchUsersLoading, setFetchUsersLoading] = useState(false)
	const [addAccessibilityLoading, setAddAccessibilityLoading] = useState(false)

	const onSearchKeyword = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const queries = getRouteQueries()
		const keyword = (event.currentTarget.elements[0] as HTMLInputElement).value

		if (!keyword.length || queries.keyword === keyword) return

		const updateQueries = generateRouteQueries({ ...queries, keyword })
		router.replace(`/martyrs?${updateQueries}`)
		fetchMartyrs(martyrsRepo, 0)
	}

	const fetchUsersOptions = async (type: 'viewers' | 'indexers', name: string) => {
		const viewerMode = type === 'viewers'
		setViewersOptions([])
		setIndexersOptions([])

		setFetchUsersLoading(true)
		const result = await users.get({
			role: viewerMode ? 30 : 3,
			'name[$like]': `%${name}%`,
		})
		setFetchUsersLoading(false)
		if (!result) return

		if (viewerMode) {
			setViewersOptions(result.data)
		} else {
			setIndexersOptions(result.data)
		}
	}

	const addAccessibility = async (payload: AddAccessibilityPayload & { user: User }) => {
		const result = await usersMartyrs.post(payload)
		if (!result) return
		addUserToMartyr(payload.martyr_id, payload.user, result.id)
	}

	const onAddAccessibility = async (event: FormEvent) => {
		event.preventDefault()
		setAddAccessibilityLoading(true)
		for (const martyrId of selected) {
			const martyr = martyrs.data.find((m) => m.id === martyrId)
			if (!martyr) continue

			const viewers = martyr.users_martyrs.map((um) => um.role_type === 30 && um.user_id)
			const indexers = martyr.users_martyrs.map((um) => um.role_type === 3 && um.user_id)

			for (const viewer of viewersValues) {
				if (viewers.includes(viewer.id)) continue
				await addAccessibility({
					user: viewer,
					role_type: 30,
					user_id: viewer.id,
					martyr_id: martyrId,
				})
			}

			for (const indexer of indexersValues) {
				if (indexers.includes(indexer.id)) continue
				await addAccessibility({
					role_type: 3,
					user: indexer,
					user_id: indexer.id,
					martyr_id: martyrId,
				})
			}
		}
		setAddAccessibilityLoading(false)

		onCloseDialog()
	}

	const onCloseDialog = () => {
		setVisible(false)
		setSelected([])
		setViewersOptions([])
	}
	return (
		<>
			<DefaultLayout>
				<Typography variant="h5" className="text-center mb-5">
					شهدا
				</Typography>

				<Section>
					{selected.length ? (
						<Button
							size="small"
							variant="contained"
							className="text-white mt-4"
							onClick={() => setVisible(true)}
						>
							مدیریت سطوح دسترسی
						</Button>
					) : (
						<form className="flex gap-4 items-end" onSubmit={onSearchKeyword}>
							<TextField
								label="نام | نام خانوادگی | شماره پرونده"
								variant="standard"
								className="w-64"
								defaultValue={getRouteQueries().keyword}
							/>

							<Button
								size="small"
								type="submit"
								variant="contained"
								className="text-white"
								disabled={fetchLoading}
							>
								جستجو
							</Button>
						</form>
					)}
				</Section>

				<MartyrsTable />
			</DefaultLayout>

			<AppDialog visible={visible} header="مدیریت سطوح دسترسی" onClose={onCloseDialog}>
				<ManageAccessibilityForm onSubmit={onAddAccessibility}>
					<AppAutoComplete
						multiple
						disableClearable
						label="بازبین کننده ها"
						options={viewersOptions}
						className="w-full"
						onChange={(e) => setViewersValues(e)}
						fetchLoading={fetchUsersLoading}
						onSendRequest={(e) => fetchUsersOptions('viewers', e)}
						optionLabel={(op) => op.name}
					/>

					<AppAutoComplete
						multiple
						disableClearable
						label="نمایه گر ها"
						options={indexersOptions}
						className="w-full"
						onChange={(e) => setIndexersValues(e)}
						fetchLoading={fetchUsersLoading}
						onSendRequest={(e) => fetchUsersOptions('indexers', e)}
						optionLabel={(op) => op.name}
					/>

					<LoadingButton
						size="small"
						type="submit"
						variant="contained"
						className="text-white"
						loading={addAccessibilityLoading}
					>
						ثبت
					</LoadingButton>
				</ManageAccessibilityForm>
			</AppDialog>
		</>
	)
}

// ? styles
const Section = tw.section`md:absolute -top-4`
const ManageAccessibilityForm = styled.form(() => [
	'min-width:20rem;',
	tw`flex flex-col items-center justify-center gap-8`,
])
