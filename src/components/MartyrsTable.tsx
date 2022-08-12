// ? react
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRouteQueries } from '@/router'
// ? utils
import userStore from '@/stores/user'
import { useRepositories } from '@/repositories'
import martyrsStore, { columns } from '@/stores/martyrs'
// ? components
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { LoadingButton } from '@mui/lab'
import Button from '@mui/material/Button'
import { BoxLoading } from 'react-loadingg'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import MartyrsTableUsersChips from './MartyrsTableUsersChips'
// ? types
import type { MartyrPaginate, Martyr } from '@/repositories/martyrs/types'

const countDocsStatus = (
	docs: MartyrPaginate['documents'],
	status: Martyr['documents'][0]['status']
) => {
	const filtered = docs.filter((doc) => doc.status === status)
	return filtered.length
}

export default function MartyrsTable() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { user } = userStore()
	const queries = getRouteQueries()
	const { martyrs: martyrsRepo } = useRepositories()
	const { page, martyrs, selected, clearStore, setSelected, fetchMartyrs, fetchLoading } =
		martyrsStore()

	const [deleteLoading, setDeleteLoading] = useState('')
	const [rowsPerPage, setRowsPerPage] = useState(Number(queries.rowsPerPage) || 10)

	const isSelected = (id: string) => selected.indexOf(id) !== -1

	const handleSelect = (event: React.MouseEvent<unknown>, id: string) => {
		const selectedIndex = selected.indexOf(id)
		let newSelected: string[] = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			)
		}

		setSelected(newSelected)
	}

	const deleteMartyr = async (id: string) => {
		const sure = confirm('مطمئنید میخواهید این شهید را حذف کنید ؟')
		if (!sure) return

		setDeleteLoading(id)
		const result = await martyrsRepo.delete(id)
		setDeleteLoading('')
		if (result) fetchMartyrs(martyrsRepo, page)
	}

	useEffect(() => {
		fetchMartyrs(martyrsRepo, Number(queries.page) || 0, Number(queries.rowsPerPage) || rowsPerPage)
		return () => {
			clearStore()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value)
		fetchMartyrs(martyrsRepo, 0, +event.target.value)
	}

	if (fetchLoading) return <BoxLoading color="#c5a711" />

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							{columns(user?.role).map((column) => (
								<TableCell key={column.key} align={column.align}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{martyrs.data?.map((row, index) => {
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
									{columns(user?.role).map((column) => {
										if (column.key === 'checkbox') {
											return (
												<TableCell key={column.key} padding="checkbox">
													<Checkbox
														color="primary"
														checked={isSelected(row.id)}
														onClick={(event) => handleSelect(event, row.id)}
													/>
												</TableCell>
											)
										} else if (column.key === 'index') {
											return (
												<TableCell key={column.key} align={'center'}>
													{page * rowsPerPage + (index + 1) || index + 1}
												</TableCell>
											)
										} else if (column.key === 'name') {
											return (
												<TableCell key={column.key}>
													{row.name} {row.lastName}
												</TableCell>
											)
										} else if (column.key === 'code') {
											return <TableCell key={column.key}>{row.code}</TableCell>
										} else if (column.key === 'reviewer') {
											// if (user?.role === 48)
											return (
												<TableCell key={column.key} sx={{ maxWidth: '250px' }}>
													<MartyrsTableUsersChips
														type="reviewer"
														martyrIndex={index}
														usersMartyrs={row.users_martyrs}
													/>
												</TableCell>
											)
										} else if (column.key === 'indexer') {
											// if (user?.role === 48)
											return (
												<TableCell key={column.key} sx={{ maxWidth: '250px' }}>
													<MartyrsTableUsersChips
														type="indexer"
														martyrIndex={index}
														usersMartyrs={row.users_martyrs}
													/>
												</TableCell>
											)
										} else if (column.key === 'allDocs') {
											return (
												<TableCell key={column.key} align={'center'}>
													{row.documents.length}
												</TableCell>
											)
										} else if (column.key === 'doingStatus') {
											return (
												<TableCell key={column.key} align={'center'}>
													{countDocsStatus(row.documents, 'doing')}
												</TableCell>
											)
										} else if (column.key === 'sendForReviewerStatus') {
											return (
												<TableCell key={column.key} align={'center'}>
													{countDocsStatus(row.documents, 'sendForReviewer')}
												</TableCell>
											)
										} else if (column.key === 'doneStatus') {
											return (
												<TableCell key={column.key} align={'center'}>
													{countDocsStatus(row.documents, 'done')}
												</TableCell>
											)
										} else if (column.key === 'operations') {
											return (
												<TableCell key={column.key} align={'center'}>
													<div className="flex justify-center gap-2">
														<Link
															to={`/documents?id=${row.id}&name=${
																row.name + ' ' + row.lastName
															}&code=${row.code}`}
														>
															<Button variant="contained" size="small" className="text-white">
																اسناد
															</Button>
														</Link>

														<Link to={`/martyrs?id=${row.id}`}>
															<Button variant="contained" size="small" className="text-white">
																اطلاعات
															</Button>
														</Link>

														<LoadingButton
															variant="contained"
															size="small"
															color="error"
															loading={deleteLoading === row.id}
															onClick={() => deleteMartyr(row.id)}
														>
															حذف
														</LoadingButton>
													</div>
												</TableCell>
											)
										}

										return <TableCell key={column.key} align={column.align}></TableCell>
									})}
								</TableRow>
							)
						})}
					</TableBody>
				</Table>

				<TablePagination
					page={page}
					component={'div'}
					count={martyrs.total | 0}
					rowsPerPage={rowsPerPage}
					rowsPerPageOptions={[10, 20, 40]}
					onPageChange={(_event, newPage) => fetchMartyrs(martyrsRepo, newPage, rowsPerPage)}
					labelRowsPerPage={'تعداد در صفحه'}
					onRowsPerPageChange={handleChangeRowsPerPage}
					labelDisplayedRows={({ from, to, count }) => `${from} تا ${to} از ${count}`}
				/>
			</TableContainer>
		</Paper>
	)
}
