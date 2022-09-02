// ? react
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// ? utils
import { useRepositories } from '@/repositories'
// ? components
import Table from '@mui/material/Table'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { BoxLoading } from 'react-loadingg'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import LoadingButton from '@mui/lab/LoadingButton'
import AppTitleTypeA from '@/components/AppTitleTypeA'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import MartyrSectionKRelativesDialog from '@/components/MartyrSectionKRelativesDialog'
// ? types
import type { Relative, Relatives } from '@/repositories/relatives/types'

const rowsPerPage = 10
const columns = [
	{ key: 'index', label: 'ردیف' },
	{ key: 'name', label: 'نام و نام خانوادگی', align: 'left' },
	{ key: 'relation', label: 'نسبت' },
	{ key: 'education', label: 'تحصیلات' },
	{ key: 'job', label: 'شغل' },
	{ key: 'operations', label: 'عملیات' },
]

export default function MartyrSectionKRelatives() {
	const { id } = useParams()
	const { relatives: relativesRepo } = useRepositories()

	const [page, setPage] = useState(0)
	const [fetchLoading, setFetchLoading] = useState(false)
	const [relatives, setRelatives] = useState({} as Relatives)
	const [removeLoading, setRemoveLoading] = useState(0)

	const [visibleDialog, setVisibleDialog] = useState(false)
	const [selectedRelative, setSelectedRelative] = useState({} as Relative)

	const fetchRelatives = async (page: number) => {
		const payload = {
			martyr_id: id,
			$limit: rowsPerPage,
			$skip: page * rowsPerPage,
		}

		setFetchLoading(true)
		const result = await relativesRepo.get(payload)
		setFetchLoading(false)
		if (!result) return

		setPage(page)
		setRelatives(result)
	}

	useEffect(() => {
		fetchRelatives(0)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const deleteRelative = async (id: number) => {
		const sure = confirm('مطمئنید میخواهید این مورد را حذف کنید ؟')
		if (!sure) return

		setRemoveLoading(id)
		const result = await relativesRepo.delete(id)
		setRemoveLoading(0)
		if (result) fetchRelatives(page)
	}

	const showDialog = (relative: Relative) => {
		setSelectedRelative(relative)
		setVisibleDialog((curr) => !curr)
	}

	return (
		<>
			<header className="flex justify-between my-5">
				<AppTitleTypeA title="وابستگان" />

				<Button size="small" variant="contained">
					افزودن
				</Button>
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
										<TableCell key={column.key} align={(column.align as 'left') || 'center'}>
											{column.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>

							<TableBody>
								{relatives.data?.map((row, index) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
											{columns.map((column) => {
												if (column.key === 'index') {
													return (
														<TableCell key={column.key} align={'center'}>
															{page * rowsPerPage + (index + 1) || index + 1}
														</TableCell>
													)
												} else if (column.key === 'name') {
													return (
														<TableCell key={column.key} align={'left'}>
															{row.name}
														</TableCell>
													)
												} else if (column.key === 'relation') {
													return (
														<TableCell key={column.key} align={'center'}>
															{row.relation}
														</TableCell>
													)
												} else if (column.key === 'education') {
													return (
														<TableCell key={column.key} align={'center'}>
															{row.education}
														</TableCell>
													)
												} else if (column.key === 'job') {
													return (
														<TableCell key={column.key} align={'center'}>
															{row.job}
														</TableCell>
													)
												} else if (column.key === 'operations') {
													return (
														<TableCell key={column.key} align={'center'}>
															<div className="flex justify-center gap-2">
																<Button
																	variant="contained"
																	size="small"
																	className="text-white"
																	onClick={() => showDialog(row)}
																>
																	جزئیات
																</Button>

																<LoadingButton
																	size="small"
																	color="error"
																	variant="contained"
																	onClick={() => deleteRelative(row.id)}
																	loading={removeLoading === row.id}
																>
																	حذف
																</LoadingButton>
															</div>
														</TableCell>
													)
												}

												return (
													<TableCell
														key={column.key}
														align={(column.align as 'right') || 'center'}
													></TableCell>
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
							count={relatives.total | 0}
							rowsPerPage={rowsPerPage}
							onPageChange={(_event, newPage) => fetchRelatives(newPage)}
							labelDisplayedRows={({ from, to, count }) => `${from} تا ${to} از ${count}`}
						/>
					</TableContainer>
				</Paper>
			)}

			<MartyrSectionKRelativesDialog
				show={visibleDialog}
				relative={selectedRelative}
				onStore={() => fetchRelatives(0)}
				onClose={() => {
					setVisibleDialog((curr) => !curr)
				}}
			/>
		</>
	)
}
