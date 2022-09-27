/* eslint-disable no-param-reassign */
// ? react
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { generateRouteQueries, getRouteQueries, history as router } from '@/router'
// ? utils
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
import AppDialog from '@/components/AppDialog'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import Typography from '@mui/material/Typography'
import DefaultLayout from '@/components/DefaultLayout'
import AppDatepicker from '@/components/AppDatepicker'
import TableContainer from '@mui/material/TableContainer'
// ? types
import type { UserWithWorksReport, GetUsersWorksReportPayload } from '@/repositories/users/types'

const columns = [
	{ key: 'index', label: 'ردیف', align: 'center' },
	{ key: 'start_time', label: 'تاریخ', align: 'center' },
	{ key: 'sum_time', label: 'زمان کاری', align: 'center' },
	{ key: 'countDocs', label: 'تعداد اسناد', align: 'center' },
	{ key: 'operations', label: 'عملیات', align: 'center' },
]

export default function UserWorksReport() {
	const { id } = useParams()
	const queries = getRouteQueries()
	const { users: usersRepo } = useRepositories()

	const today = new Date().toISOString().split('T')[0]
	const [fetchLoading, setFetchLoading] = useState(false)
	const [showDetailDialog, setShowDetailDialog] = useState(false)
	const [selectedForDetail, setSelectedForDetail] = useState(
		{} as UserWithWorksReport['group_reports'][0]
	)

	const [userReport, setUserReport] = useState({} as UserWithWorksReport)
	const [rangeDate, setRangeDate] = useState(undefined as undefined | string[])

	const sumTime = (r: UserWithWorksReport['group_reports'][0]) => {
		const mins = r.min + r.sec / 60
		return `${Math.round(mins / 60)}:${Math.round(mins % 60)}`
	}

	const setReportWithDetails = (user: UserWithWorksReport) => {
		if (!user) return
		let status = 'ffffffffffffff'
		if (user.role === 3) status = 'بازبین'
		if (user.role === 30) status = 'اتمام'

		// this gives an object with dates as keys
		const reports = user.working_reports.reduce((r, row) => {
			const date = row.start_time.split('T')[0]
			if (!r[date]) r[date] = { data: [], countDocs: 0, min: 0, sec: 0, date }
			if (row.report) r[date].countDocs += row.report.split(status).length - 1

			r[date].min += row.sum_min
			r[date].sec += row.sum_sec
			r[date].data.push(row)
			return r
		}, {} as { [key: string]: UserWithWorksReport['group_reports'][0] })

		// Edit: to add it in the array format instead
		const u = Object.keys(reports).map((date) => {
			return { ...reports[date] }
		})
		user.group_reports = u.sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime()
		})

		setUserReport(user)
	}

	const initDefaultRangDate = () => {
		let start = rangeDate ? rangeDate[0] : queries.start_time
		let end = rangeDate ? rangeDate[1] : queries.end_time

		if (!end || !start) {
			start = getJalaliWrapper(today).subtract(1, 'week').format('YYYY-MM-DD')
			start = gregoryDate(start, 'YYYY-MM-DD') as string
			end = today
		}

		setRangeDate([start, end])
		return [start, end]
	}

	const fetchUserWorksReport = async () => {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const [start_time, end_time] = initDefaultRangDate()

		const payload = {
			end_time,
			start_time,
			id: Number(id),
			'$sort[start_time]': -1,
		} as GetUsersWorksReportPayload

		setFetchLoading(true)
		const result = await usersRepo.getWorksReport(payload)
		setFetchLoading(false)
		if (!result) return

		setReportWithDetails(result.data[0])

		const q = { end_time, start_time }

		const updatedQueries = generateRouteQueries(q)
		router.replace(`/users/${id}/works-report?${updatedQueries}`)
	}

	useEffect(() => {
		fetchUserWorksReport()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<DefaultLayout>
				<header className="my-6">
					<Typography variant="h5" className="text-center mb-5">
						مدیریت عملکرد {queries.name}
					</Typography>

					<SearchForm
						onSubmit={(e) => {
							e.preventDefault()
							fetchUserWorksReport()
						}}
					>
						<AppDatepicker
							range
							maxDate={jalaliDate(today) as string}
							defaultValue={rangeDate}
							label="محدوده تاریخ"
							onChange={(e) => setRangeDate(e as string[])}
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
									{userReport.group_reports?.map((row, index) => {
										return (
											<TableRow hover tabIndex={-1} key={row.date}>
												{columns.map((column) => {
													if (column.key === 'index') {
														return (
															<TableCell key={column.key} align="center">
																{index + 1}
															</TableCell>
														)
													}
													if (column.key === 'start_time') {
														return (
															<TableCell key={column.key} align="center">
																{jalaliDate(row.date)}
															</TableCell>
														)
													}
													if (column.key === 'sum_time') {
														return (
															<TableCell key={column.key} align="center">
																{sumTime(row)}
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
																<Button
																	onClick={() => {
																		setSelectedForDetail(row)
																		setShowDetailDialog(true)
																	}}
																>
																	جزئیات
																</Button>
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
						</TableContainer>
					</Paper>
				)}
			</DefaultLayout>

			<ReportDetailsDialog
				showDetailDialog={showDetailDialog}
				report={selectedForDetail}
				closed={() => setShowDetailDialog(false)}
			/>
		</>
	)
}

interface DialogProps {
	closed: () => void
	showDetailDialog: boolean
	report: UserWithWorksReport['group_reports'][0]
}
function ReportDetailsDialog({ showDetailDialog, closed, report }: DialogProps) {
	return (
		<AppDialog visible={showDetailDialog} onClose={closed}>
			<Typography variant="h5" marginBottom="2rem" textAlign="center">
				جزئیات گزارش در تاریخ {jalaliDate(report.date)}
			</Typography>

			{showDetailDialog && (
				<OrderList>
					{report.data.map((r) => (
						<li key={r.id}>
							<span>از ساعت: {jalaliDate(r.start_time, 'dateTime')}</span>|
							<span>تا ساعت: {jalaliDate(r.end_time, 'dateTime')}</span> |
							<span>
								مجموع: {r.sum_min}:{r.sum_sec}
							</span>
							<DiskList>
								{(JSON.parse(r.report) as string[]).map((rep, index) => (
									// eslint-disable-next-line react/no-array-index-key
									<li key={index}>{rep}</li>
								))}
							</DiskList>
						</li>
					))}
				</OrderList>
			)}
		</AppDialog>
	)
}

const SearchForm = styled.form(() => [tw`flex items-end gap-4`])
const OrderList = tw.ul`list-decimal mx-4`
const DiskList = tw.ul`list-disc my-1 mr-4`
