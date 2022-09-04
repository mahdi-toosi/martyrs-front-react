// ? react
import { useEffect, useState } from 'react'
// ? utils
import tw, { styled } from 'twin.macro'
// ? components
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
// ? types
import type { Users_Martyrs_Relation } from '@/repositories/users/types'
import { jalaliDate } from '@/utils/day'
import AppBarChart from './AppBarChart'
type Docs = Users_Martyrs_Relation['martyr']['documents']

const countDocsStatus = (docs: Docs, status: Docs[0]['status']) => {
	const filtered = docs.filter((doc) => doc.status === status)
	return filtered.length
}

const columns = [
	{ key: 'index', label: 'ردیف', align: 'center' },
	{ key: 'code', label: 'شماره پرونده' },
	{ key: 'start', label: 'تاریخ واگذاری', align: 'center' },
	{ key: 'name', label: 'شهید' },
	{ key: 'fatherName', label: 'نام پدر' },
	{ key: 'allDocs', label: 'تعداد اسناد', align: 'center' },
	{ key: 'doingStatus', label: 'در حال انجام', align: 'center' },
	{ key: 'sendForReviewerStatus', label: 'ارسال شده برای بازبین', align: 'center' },
	{ key: 'doneStatus', label: 'تایید شده', align: 'center' },
]

interface Props {
	user_martyrs: Users_Martyrs_Relation[]
}
export default function UserMartyrsStatistics({ user_martyrs }: Props) {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)

	const [statistics, setStatistics] = useState({
		beginDate: '',
		doneDocs: 0,
		allDocs: [] as Docs,
	})

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	useEffect(() => {
		if (!user_martyrs || !user_martyrs.length) return

		let beginDate = '',
			doneDocs = 0,
			allDocs = [] as Docs

		user_martyrs.sort(function (a, b) {
			return new Date(a.start).getTime() - new Date(b.start).getTime()
		})
		beginDate = user_martyrs[0].start

		for (const userMartyrRelation of user_martyrs) {
			allDocs = [...allDocs, ...userMartyrRelation.martyr.documents]
		}
		doneDocs = allDocs.filter((d) => d.status === 'done').length

		setStatistics({ beginDate, allDocs, doneDocs })
	}, [user_martyrs])
	return (
		<>
			<section className="my-6">
				<AppBarChart value={Math.floor((statistics.doneDocs * 100) / statistics.allDocs.length)} />

				<ChartDetailsWrapper>
					<li>
						<span className="bg-opacity-100"></span> تعداد اسناد در اختیار گذاشته شده:{' '}
						{statistics.allDocs.length}
					</li>

					<li>
						<span></span> تعداد اسناد گویا سازی شده: {statistics.doneDocs}
					</li>

					<li>تاریخ شروع نمایه سازی: {jalaliDate(statistics.beginDate) || '--'}</li>
				</ChartDetailsWrapper>
			</section>

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
							{user_martyrs
								?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								?.map((row, index) => {
									return (
										<TableRow hover tabIndex={-1} key={row.martyr_id}>
											{columns.map((column) => {
												if (column.key === 'index') {
													return (
														<TableCell key={column.key} align={'center'}>
															{page * rowsPerPage + (index + 1) || index + 1}
														</TableCell>
													)
												} else if (column.key === 'code') {
													return <TableCell key={column.key}>{row.martyr.code}</TableCell>
												} else if (column.key === 'start') {
													return (
														<TableCell key={column.key} align={'center'}>
															{jalaliDate(row.start, 'dateTime')}
														</TableCell>
													)
												} else if (column.key === 'name') {
													return (
														<TableCell key={column.key}>
															{row.martyr.name} {row.martyr.lastName}
														</TableCell>
													)
												} else if (column.key === 'fatherName') {
													// if (user?.role === 48)
													return <TableCell key={column.key}>{row.martyr.fatherName}</TableCell>
												} else if (column.key === 'allDocs') {
													return (
														<TableCell key={column.key} align={'center'}>
															{row.martyr.documents.length}
														</TableCell>
													)
												} else if (column.key === 'doingStatus') {
													return (
														<TableCell key={column.key} align={'center'}>
															{countDocsStatus(row.martyr.documents, 'doing')}
														</TableCell>
													)
												} else if (column.key === 'sendForReviewerStatus') {
													return (
														<TableCell key={column.key} align={'center'}>
															{countDocsStatus(row.martyr.documents, 'sendForReviewer')}
														</TableCell>
													)
												} else if (column.key === 'doneStatus') {
													return (
														<TableCell key={column.key} align={'center'}>
															{countDocsStatus(row.martyr.documents, 'done')}
														</TableCell>
													)
												}

												return (
													<TableCell key={column.key} align={column.align as 'right'}></TableCell>
												)
											})}
										</TableRow>
									)
								})}
						</TableBody>
					</Table>

					<TablePagination
						page={page}
						component={'div'}
						rowsPerPage={rowsPerPage}
						count={user_martyrs?.length | 0}
						rowsPerPageOptions={[10, 20, 40]}
						labelRowsPerPage={'تعداد در صفحه'}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						labelDisplayedRows={({ from, to, count }) => `${from} تا ${to} از ${count}`}
					/>
				</TableContainer>
			</Paper>
		</>
	)
}

const ChartDetailsWrapper = styled.ul(() => [
	tw`mt-4 flex gap-6`,
	{
		span: tw`w-3.5 h-3.5 border rounded-full bg-primary bg-opacity-40 inline-block`,
		li: tw`flex items-center gap-2`,
	},
])
