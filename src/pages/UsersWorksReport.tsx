/* eslint-disable no-param-reassign */
// ? react
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { generateRouteQueries, getRouteQueries, history as router } from '@/router'
// ? utils
import { roles } from '@/stores/user'
import tw, { styled } from 'twin.macro'
import { useRepositories } from '@/repositories'
import { jalaliDate, getJalaliWrapper, gregoryDate } from '@/utils/day'
// ? components
import Table from '@mui/material/Table'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { BoxLoading } from 'react-loadingg'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import Typography from '@mui/material/Typography'
import DefaultLayout from '@/components/DefaultLayout'
import AppDropdown from '@/components/AppDropDown'
import AppDatepicker from '@/components/AppDatepicker'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
// ? types
import type { GetUsersWorksReportPayload, UsersWithWorksReport } from '@/repositories/users/types'

type Filters = { rangeDate?: string[]; role?: number }

const columns = [
	{ key: 'index', label: 'ردیف', align: 'center' },
	{ key: 'name', label: 'نام و نام خانوادگی' },
	{ key: 'role', label: 'نقش', align: 'center' },
	{ key: 'sum_time', label: 'زمان کاری', align: 'center' },
	{ key: 'countDocs', label: 'تعداد اسناد', align: 'center' },
	{ key: 'operations', label: 'عملیات', align: 'center' },
]

export default function UsersWorksReport() {
	const queries = getRouteQueries()
	const { users: usersRepo } = useRepositories()

	const [page, setPage] = useState(0)
	const [filters, setFilters] = useState({} as Filters)
	const today = new Date().toISOString().split('T')[0]
	const [rowsPerPage] = useState(30)
	const [fetchLoading, setFetchLoading] = useState(false)
	const [usersReport, setUsersReport] = useState({} as UsersWithWorksReport)

	const rolesOptions = useMemo(() => {
		return Object.keys(roles).map((roleKey) => ({
			label: roles[Number(roleKey) as keyof typeof roles],
			value: Number(roleKey),
		}))
	}, [])

	const setReportWithDetails = (report: UsersWithWorksReport) => {
		if (!report.data || !report.data.length) return
		report.data.forEach((user) => {
			let status = 'ffffffffffffff'
			if (user.role === 3) status = 'بازبین'
			if (user.role === 30) status = 'اتمام'

			let countDocs = 0
			let min = 0
			let sec = 0
			// this gives an object with dates as keys
			user.working_reports.forEach((row) => {
				if (row.report && user.role < 48) countDocs += row.report.split(status).length - 1
				min += row.sum_min
				sec += row.sum_sec
			})

			user.countDocs = countDocs

			min += sec / 60
			user.sum_hour = Math.round(min / 60)
			user.sum_min = Math.round(min % 60)
		})

		setUsersReport(report)
	}

	const calcRangDate = () => {
		let start = filters.rangeDate ? filters.rangeDate[0] : queries.start_time
		let end = filters.rangeDate ? filters.rangeDate[1] : queries.end_time

		if (!end || !start) {
			start = getJalaliWrapper(today).subtract(1, 'month').format('YYYY-MM-DD')
			start = gregoryDate(start, 'YYYY-MM-DD') as string
			end = today
		}

		setFilters((v) => ({ ...v, rangeDate: [start, end] }))
		return [start, end]
	}

	const fetchUsersWorksReport = async (newPage?: number, newRowsPerPage?: number) => {
		const currQueries = getRouteQueries()

		const currPage = newPage === 0 ? 0 : Number(currQueries.page) || 0
		const currRowsPerPage = newRowsPerPage || Number(currQueries.rowsPerPage) || 10
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const [start_time, end_time] = calcRangDate()

		const payload = {
			end_time,
			start_time,
			'$sort[start_time]': -1,
			$limit: currRowsPerPage,
			role: filters.role || queries.role,
			$skip: currPage * currRowsPerPage,
		} as GetUsersWorksReportPayload

		setFetchLoading(true)
		const result = await usersRepo.getWorksReport(payload)
		setFetchLoading(false)
		if (!result) return

		setPage(currPage)
		setReportWithDetails(result)

		const q = { end_time, start_time, role: filters.role || queries.role }
		const updatedQueries = generateRouteQueries(q)
		router.replace(`/users/works-report?${updatedQueries}`)
	}

	useEffect(() => {
		fetchUsersWorksReport(Number(queries.page) || 0, Number(queries.rowsPerPage) || rowsPerPage)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<DefaultLayout>
			<header className="my-6">
				<Typography variant="h5" className="text-center mb-5">
					مدیریت عملکرد {queries.name}
				</Typography>

				<SearchForm
					onSubmit={(e) => {
						e.preventDefault()
						fetchUsersWorksReport()
					}}
				>
					<AppDatepicker
						range
						maxDate={jalaliDate(today) as string}
						defaultValue={filters.rangeDate}
						label="محدوده تاریخ"
						onChange={(e) => setFilters((v) => ({ ...v, rangeDate: e as string[] }))}
					/>

					<AppDropdown
						label="نقش"
						className="w-44"
						options={rolesOptions}
						defaultValue={queries.role}
						onChange={(e) => setFilters((v) => ({ ...v, role: e as number }))}
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
				</SearchForm>
			</header>

			{fetchLoading ? (
				<BoxLoading color="#c5a711" />
			) : (
				<Paper sx={{ width: '100%', overflow: 'hidden' }}>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									{columns.map((column) => (
										<TableCell key={column.key} align={column.align as 'right'}>
											{column.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>

							<TableBody>
								{usersReport.data?.map((row, index) => {
									return (
										<TableRow hover tabIndex={-1} key={row.id}>
											{columns.map((column) => {
												if (column.key === 'index') {
													return (
														<TableCell key={column.key} align="center">
															{page * rowsPerPage + (index + 1) || index + 1}
														</TableCell>
													)
												}
												if (column.key === 'name') {
													return <TableCell key={column.key}>{row.name}</TableCell>
												}
												if (column.key === 'role') {
													return (
														<TableCell key={column.key} align="center">
															{roles[row.role as keyof typeof roles]}
														</TableCell>
													)
												}
												if (column.key === 'sum_time') {
													return (
														<TableCell key={column.key} align="center">
															{row.sum_hour}:{row.sum_min}
														</TableCell>
													)
												}
												if (column.key === 'countDocs') {
													return (
														<TableCell key={column.key} align="center">
															{row.countDocs}
														</TableCell>
													)
												}
												if (column.key === 'operations') {
													return (
														<TableCell key={column.key} align="center">
															<Link to={`/users/${row.id}/works-report?name=${row.name}`}>
																<Button variant="contained" size="small" className="text-white">
																	جزئیات
																</Button>
															</Link>
														</TableCell>
													)
												}

												return <TableCell key={column.key} align={column.align as 'right'} />
											})}
										</TableRow>
									)
								})}
							</TableBody>
						</Table>

						<TablePagination
							page={page}
							component="div"
							count={usersReport.total || 0}
							rowsPerPage={rowsPerPage}
							rowsPerPageOptions={[30]}
							onPageChange={(_event, newPage) => fetchUsersWorksReport(newPage, rowsPerPage)}
							labelRowsPerPage="تعداد در صفحه"
							labelDisplayedRows={({ from, to, count }) => `${from} تا ${to} از ${count}`}
						/>
					</TableContainer>
				</Paper>
			)}
		</DefaultLayout>
	)
}

const SearchForm = styled.form(() => [tw`flex items-end gap-4`])
