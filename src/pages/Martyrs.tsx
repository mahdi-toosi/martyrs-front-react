// ? react
import { FormEvent, useEffect, useState } from 'react'
import { getRouteQueries, history as router, generateRouteQueries } from '@/router'
// ? utils
import { debounce } from 'lodash'
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
import Autocomplete from '@mui/material/Autocomplete'
import DefaultLayout from '@/components/DefaultLayout'
import CircularProgress from '@mui/material/CircularProgress'
// ? types
import type { User } from '@/repositories/users/types'
import type { AddAccessibilityPayload } from '@/repositories/usersMartyrs/types'

export default function Martyrs() {
	const { martyrs: martyrsRepo, users, usersMartyrs } = useRepositories()
	const { fetchMartyrs, martyrs, fetchLoading, selected, setSelected, addUserToMartyr } =
		martyrsStores()

	const [visible, setVisible] = useState(false)
	const [viewersSearchInput, setViewersSearchInput] = useState('')
	const [indexersSearchInput, setIndexersSearchInput] = useState('')

	const [openViewersOptions, setOpenViewersOptions] = useState(false)
	const [openIndexersOptions, setOpenIndexersOptions] = useState(false)

	const [viewersOptions, setViewersOptions] = useState([] as User[])
	const [indexersOptions, setIndexersOptions] = useState([] as User[])

	const [viewersValues, setViewersValues] = useState([] as User[])
	const [indexersValues, setIndexersValues] = useState([] as User[])

	const [fetchUsersLoading, setFetchUsersLoading] = useState(false)
	const [addAccessibilityLoading, setAddAccessibilityLoading] = useState(false)

	const viewersLoading = openViewersOptions && fetchUsersLoading
	const indexersLoading = openIndexersOptions && fetchUsersLoading

	const onSearchKeyword = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const queries = getRouteQueries()
		const keyword = (event.currentTarget.elements[0] as HTMLInputElement).value

		if (!keyword.length || queries.keyword === keyword) return

		const _queries = generateRouteQueries({ ...queries, keyword })
		router.replace(`/martyrs?${_queries}`)
		fetchMartyrs(martyrsRepo, 0)
	}

	const fetchUsersOptions = async (type: 'viewers' | 'indexers', name: string) => {
		const viewerMode = type === 'viewers'
		setViewersOptions([])
		setIndexersOptions([])

		setFetchUsersLoading(true)
		const result = await users.get({
			role: viewerMode ? 30 : 3,
			['name[$like]']: `%${name}%`,
		})
		setFetchUsersLoading(false)
		if (!result) return

		if (viewerMode) {
			setViewersOptions(result.data)
		} else {
			setIndexersOptions(result.data)
		}
	}

	useEffect(() => {
		if (!viewersSearchInput.length) return
		fetchUsersOptions('viewers', viewersSearchInput)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [viewersSearchInput])
	useEffect(() => {
		if (!indexersSearchInput.length) return
		fetchUsersOptions('indexers', indexersSearchInput)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [indexersSearchInput])

	const _setViewersSearchInput = (newVal: string) => setViewersSearchInput(newVal)
	const onUpdateViewersSearchInput = debounce(_setViewersSearchInput, 500)

	const _setIndexersSearchInput = (newVal: string) => setIndexersSearchInput(newVal)
	const onUpdateIndexersSearchInput = debounce(_setIndexersSearchInput, 500)

	const addAccessibility = async (payload: AddAccessibilityPayload & { user: User }) => {
		const result = await usersMartyrs.post(payload)
		if (!result) return
		addUserToMartyr(payload.martyr_id, payload.user, result.id)
	}

	const onAddAccessibility = async (event: FormEvent) => {
		event.preventDefault()
		setAddAccessibilityLoading(true)
		for (const martyr_id of selected) {
			const martyr = martyrs.data.find((martyr) => martyr.id === martyr_id)
			if (!martyr) continue

			const viewers = martyr.users_martyrs.map((um) => um.role_type === 30 && um.user_id)
			const indexers = martyr.users_martyrs.map((um) => um.role_type === 3 && um.user_id)

			for (const viewer of viewersValues) {
				if (viewers.includes(viewer.id)) continue
				await addAccessibility({ user: viewer, user_id: viewer.id, martyr_id, role_type: 30 })
			}

			for (const indexer of indexersValues) {
				if (indexers.includes(indexer.id)) continue
				await addAccessibility({ user: indexer, user_id: indexer.id, martyr_id, role_type: 3 })
			}
		}
		setAddAccessibilityLoading(false)

		onCloseDialog()
	}

	const onCloseDialog = () => {
		setVisible(false)
		setSelected([])
		setViewersOptions([])
		setViewersSearchInput('')
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
					<Autocomplete
						open={openViewersOptions}
						className="w-full"
						multiple
						disableClearable
						size="small"
						onOpen={() => setOpenViewersOptions(true)}
						onClose={() => setOpenViewersOptions(false)}
						isOptionEqualToValue={(option, value) => option.name === value.name}
						getOptionLabel={(option) => option.name}
						options={viewersOptions}
						loading={viewersLoading}
						onInputChange={(event, newVal) => onUpdateViewersSearchInput(newVal)}
						onChange={(event, newVal) => setViewersValues(newVal)}
						loadingText="در حال جستجو..."
						noOptionsText="نتیجه ای یافت نشد"
						renderInput={(params) => (
							<TextField
								{...params}
								label="بازبین کننده ها"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<>
											{viewersLoading ? <CircularProgress color="inherit" size={20} /> : null}
											{params.InputProps.endAdornment}
										</>
									),
								}}
							/>
						)}
					/>

					<Autocomplete
						open={openIndexersOptions}
						className="w-full"
						multiple
						disableClearable
						size="small"
						onOpen={() => setOpenIndexersOptions(true)}
						onClose={() => setOpenIndexersOptions(false)}
						isOptionEqualToValue={(option, value) => option.name === value.name}
						getOptionLabel={(option) => option.name}
						options={indexersOptions}
						loading={indexersLoading}
						onInputChange={(event, newVal) => onUpdateIndexersSearchInput(newVal)}
						onChange={(event, newVal) => setIndexersValues(newVal)}
						loadingText="در حال جستجو..."
						noOptionsText="نتیجه ای یافت نشد"
						renderInput={(params) => (
							<TextField
								{...params}
								label="نمایه گر ها"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<>
											{indexersLoading ? <CircularProgress color="inherit" size={20} /> : null}
											{params.InputProps.endAdornment}
										</>
									),
								}}
							/>
						)}
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
