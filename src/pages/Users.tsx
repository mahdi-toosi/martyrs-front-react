// ? react
import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRouteQueries, history as router, generateRouteQueries } from '@/router'
// ? utils
import tw from 'twin.macro'
import { roles } from '@/stores/user'
import { jalaliDate } from '@/utils/day'
import { useRepositories } from '@/repositories'
// ? components
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import { BoxLoading } from 'react-loadingg'
import TextField from '@mui/material/TextField'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import Typography from '@mui/material/Typography'
import DefaultLayout from '@/components/DefaultLayout'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
// ? types
import type { Martyr } from '@/repositories/martyrs/types'
import type {
	UsersPayload,
	Users as UsersType,
	UsersMartyrsRelation,
} from '@/repositories/users/types'

const countDocsStatus = (
	martyrs: UsersMartyrsRelation[],
	status: Martyr['documents'][0]['status']
) => {
	const filtered = martyrs.map(
		(relation) => relation.martyr.documents.filter((doc) => doc.status === status).length
	)
	return filtered.reduce((sum, a) => sum + a, 0)
}

const columns = [
	{ key: 'index', label: 'ردیف' },
	{ key: 'name', label: 'نام و نام خانوادگی', align: 'left' },
	{ key: 'mobile', label: 'کد کاربری' },
	{ key: 'role', label: 'نوع کاربری' },
	{ key: 'present_lastDate', label: 'آخرین ورود' },
	{ key: 'allDocs', label: 'تعداد پرونده ها' },
	{ key: 'sendForReviewerStatus', label: 'ارسالی برای بازبین' },
	{ key: 'doneStatus', label: 'تمام شده' },
	{ key: 'operations', label: 'عملیات' },
]

export default function Users() {
	const queries = getRouteQueries()
	const { users: usersRepo } = useRepositories()

	const [page, setPage] = useState(0)
	const [users, setUsers] = useState({} as UsersType)
	const [fetchLoading, setFetchLoading] = useState(false)
	const [rowsPerPage, setRowsPerPage] = useState(Number(queries.rowsPerPage) || 10)

	const onSearchKeyword = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		let keyword: string | undefined = (event.currentTarget.elements[0] as HTMLInputElement).value

		if (queries.keyword === keyword) return
		if (!keyword.length) keyword = undefined

		const updatedQueries = generateRouteQueries({ ...queries, keyword })
		router.replace(`/users?${updatedQueries}`)
		fetchUsers(0)
	}

	const fetchUsers = async (newPage?: number, newRowsPerPage?: number) => {
		const currQueries = getRouteQueries()
		const currPage = newPage === 0 ? 0 : Number(currQueries.page) || 0
		const currRowsPerPage = newRowsPerPage || Number(currQueries.rowsPerPage) || 10

		const payload = {
			$limit: currRowsPerPage,
			$skip: currPage * currRowsPerPage,
			'$sort[present_lastDate]': -1,
		} as UsersPayload

		if (currQueries.keyword) {
			payload['$or[0][name][$like]'] = `%${currQueries.keyword}%`
			payload['$or[1][mobile][$like]'] = `%${currQueries.keyword}%`
		}

		setFetchLoading(true)
		const result = await usersRepo.get(payload)
		setFetchLoading(false)
		if (!result) return

		setPage(currPage)
		setUsers(result)

		const q = {
			...currQueries,
			page: currPage,
			rowsPerPage: currRowsPerPage,
			keyword: currQueries.keyword,
		}
		const updatedQueries = generateRouteQueries(q)
		router.replace(`/users?${updatedQueries}`)
	}

	useEffect(() => {
		fetchUsers(Number(queries.page) || 0, Number(queries.rowsPerPage) || rowsPerPage)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value)
		fetchUsers(0, +event.target.value)
	}

	return (
		<DefaultLayout>
			<Typography variant="h5" className="text-center mb-5">
				مدیریت کاربران
			</Typography>

			<Section>
				<form className="flex gap-4 items-end" onSubmit={onSearchKeyword}>
					<TextField
						type="search"
						variant="standard"
						className="w-64"
						label="نام | نام خانوادگی | کد کاربری"
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
			</Section>

			{fetchLoading ? (
				<BoxLoading color="#c5a711" />
			) : (
				<Paper sx={{ width: '100%', overflow: 'hidden' }}>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									{columns.map((column) => (
										<TableCell key={column.key} align={(column.align as 'left') || 'center'}>
											{column.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>

							<TableBody>
								{users.data?.map((row, index) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={row.mobile}>
											{columns.map((column) => {
												if (column.key === 'index') {
													return (
														<TableCell key={column.key} align="center">
															{page * rowsPerPage + (index + 1) || index + 1}
														</TableCell>
													)
												}
												if (column.key === 'name') {
													return (
														<TableCell key={column.key} align="left">
															{row.name}
														</TableCell>
													)
												}
												if (column.key === 'mobile') {
													return (
														<TableCell key={column.key} align="center">
															{row.mobile}
														</TableCell>
													)
												}
												if (column.key === 'role') {
													return (
														<TableCell key={column.key} align="center">
															{roles[row.role]}
														</TableCell>
													)
												}
												if (column.key === 'present_lastDate') {
													return (
														<TableCell key={column.key} align="center">
															{jalaliDate(row.present_lastDate, 'dateTime')}
														</TableCell>
													)
												}
												if (column.key === 'allDocs') {
													return (
														<TableCell key={column.key} align="center">
															{row.users_martyrs.length}
														</TableCell>
													)
												}
												if (column.key === 'sendForReviewerStatus') {
													return (
														<TableCell key={column.key} align="center">
															{countDocsStatus(row.users_martyrs, 'sendForReviewer')}
														</TableCell>
													)
												}
												if (column.key === 'doneStatus') {
													return (
														<TableCell key={column.key} align="center">
															{countDocsStatus(row.users_martyrs, 'done')}
														</TableCell>
													)
												}
												if (column.key === 'operations') {
													return (
														<TableCell key={column.key} align="center">
															<div className="flex justify-center gap-2">
																<Link to={`/users/${row.id}?name=${row.name}`}>
																	<Button variant="contained" size="small" className="text-white">
																		مدیریت
																	</Button>
																</Link>
															</div>
														</TableCell>
													)
												}

												return (
													<TableCell
														key={column.key}
														align={(column.align as 'right') || 'center'}
													/>
												)
											})}
										</TableRow>
									)
								})}
							</TableBody>
						</Table>

						<TablePagination
							page={page}
							component="div"
							count={users.total || 0}
							rowsPerPage={rowsPerPage}
							rowsPerPageOptions={[10, 20, 40]}
							onPageChange={(_event, newPage) => fetchUsers(newPage, rowsPerPage)}
							labelRowsPerPage="تعداد در صفحه"
							onRowsPerPageChange={handleChangeRowsPerPage}
							labelDisplayedRows={({ from, to, count }) => `${from} تا ${to} از ${count}`}
						/>
					</TableContainer>
				</Paper>
			)}
		</DefaultLayout>
	)
}

// ? styles
const Section = tw.section`md:absolute -top-4`
