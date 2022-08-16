// ? react
import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRouteQueries, history as router, generateRouteQueries } from '@/router'
// ? utils
import tw from 'twin.macro'
import userStore from '@/stores/user'
import { useRepositories } from '@/repositories'
// ? components
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { LoadingButton } from '@mui/lab'
import Button from '@mui/material/Button'
import { BoxLoading } from 'react-loadingg'
import TextField from '@mui/material/TextField'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import MenuItem from '@mui/material/MenuItem'
import TableBody from '@mui/material/TableBody'
import InputLabel from '@mui/material/InputLabel'
import TableHead from '@mui/material/TableHead'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import ArrowBack from '@mui/icons-material/ArrowBack'
import DefaultLayout from '@/components/DefaultLayout'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Select, { SelectChangeEvent } from '@mui/material/Select'
// ? types
import type { DocumentsPayload, Documents as DocumentsType } from '@/repositories/documents/types'

const columns = [
	{ key: 'index', label: 'ردیف' },
	{ key: 'title', label: 'عنوان سند', align: 'left' },
	{ key: 'code', label: 'شماره سند' },
	{ key: 'sum', label: 'شرح سند', align: 'left' },
	{ key: 'status', label: 'وضعیت' },
	{ key: 'operations', label: 'عملیات' },
]

const statuses = {
	all: 'همه',
	notStart: 'شروع نشده',
	doing: 'در حال انجام',
	sendForReviewer: 'ارسالی برای بازبینی',
	done: 'انجام شده',
}

const $select = ['id', 'code', 'status', 'martyr_id', 'title', 'sum']

function sum(val: string) {
	if (val) {
		const withoutHtmlTags = val.replace(new RegExp('<[^>]*>', 'g'), '')
		return withoutHtmlTags.replace(/(([^\s]+\s\s*){8})(.*)/, '$1…') // first 8 words
	} else return ''
}

export default function Documents() {
	const { user } = userStore()
	const queries = getRouteQueries()
	const { documents: documentsRepo } = useRepositories()

	const [page, setPage] = useState(0)
	const [documents, setDocuments] = useState({} as DocumentsType)
	const [fetchLoading, setFetchLoading] = useState(false)
	const [removeLoading, setRemoveLoading] = useState('')
	const [rowsPerPage, setRowsPerPage] = useState(Number(queries.rowsPerPage) || 10)

	const handleChange = (event: SelectChangeEvent) => {
		const queries = getRouteQueries()
		const _queries = generateRouteQueries({
			...queries,
			status: event.target.value === 'all' ? undefined : event.target.value,
		})
		router.replace(`/documents?${_queries}`)
	}

	const onSearchKeyword = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const queries = getRouteQueries()
		const keyword = (event.currentTarget.elements[1] as HTMLInputElement).value

		const _queries = generateRouteQueries({
			...queries,
			keyword: keyword.length ? keyword : undefined,
		})
		router.replace(`/documents?${_queries}`)
		fetchDocuments(0, rowsPerPage)
	}

	const onRemove = async (id: string) => {
		const sure = confirm('آیا از حذف این سند مطمئن هستید؟')
		if (!sure) return

		setRemoveLoading(id)
		const result = await documentsRepo.remove(id)
		setRemoveLoading('')
		if (!result) return
		fetchDocuments()
	}

	const fetchDocuments = async (newPage?: number, newRowsPerPage?: number) => {
		const queries = getRouteQueries()

		const page = newPage === 0 ? 0 : Number(queries.page) || 0
		const rowsPerPage = newRowsPerPage || Number(queries.rowsPerPage) || 10

		const payload = {
			$select,
			$limit: rowsPerPage,
			martyr_id: queries.id,
			status: queries.status,
			$skip: page * rowsPerPage,
		} as DocumentsPayload

		if (queries.keyword) {
			payload['[title][$like]'] = `%${queries.keyword}%`
		}

		setFetchLoading(true)
		const result = await documentsRepo.get(payload)
		setFetchLoading(false)
		if (!result) return

		setPage(page)
		setDocuments(result)

		const q = { ...queries, page, rowsPerPage, keyword: queries.keyword }
		const _queries = generateRouteQueries(q)
		router.replace(`/documents?${_queries}`)
	}

	useEffect(() => {
		fetchDocuments(Number(queries.page) || 0, Number(queries.rowsPerPage) || rowsPerPage)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value)
		fetchDocuments(0, +event.target.value)
	}

	return (
		<DefaultLayout>
			<Typography variant="h5" className="text-center">
				مدیریت اسناد شهید {queries.name}
			</Typography>

			<Section className="">
				<form className="flex gap-4 items-end" onSubmit={onSearchKeyword}>
					<FormControl className="w-44">
						<InputLabel id="demo-simple-select-label">وضعیت</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							defaultValue={queries.status || 'all'}
							label="وضعیت"
							size="small"
							variant="standard"
							onChange={handleChange}
						>
							{Object.keys(statuses).map((key) => (
								<MenuItem key={key} value={key}>
									{statuses[key as keyof typeof statuses]}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						label="عنوان سند"
						variant="standard"
						className="w-56"
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

				<div className="flex items-center gap-8">
					{/* TODO => add functionality 👇🏻 */}
					<Button size="small" variant="contained" className="text-white">
						افزودن
					</Button>

					<IconButton>
						<ArrowBack />
					</IconButton>
				</div>
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
								{documents.data?.map((row, index) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
											{columns.map((column) => {
												if (column.key === 'index') {
													return (
														<TableCell key={column.key} align={'center'}>
															{page * rowsPerPage + (index + 1) || index + 1}
														</TableCell>
													)
												} else if (column.key === 'title') {
													return (
														<TableCell key={column.key} align={'left'}>
															{row.title}
														</TableCell>
													)
												} else if (column.key === 'code') {
													return (
														<TableCell key={column.key} align={'center'}>
															{row.code}
														</TableCell>
													)
												} else if (column.key === 'sum') {
													return (
														<TableCell key={column.key} align={'left'}>
															{sum(row.sum)}
														</TableCell>
													)
												} else if (column.key === 'status') {
													return (
														<TableCell key={column.key} align={'center'}>
															{statuses[row.status]}
														</TableCell>
													)
												} else if (column.key === 'operations') {
													return (
														<TableCell key={column.key} align={'center'}>
															<div className="flex justify-center gap-2">
																<Link
																	to={`/documents/${row.id}?name=${queries.name}&code=${queries.code}`}
																>
																	<Button variant="contained" size="small" className="text-white">
																		جزئیات سند
																	</Button>
																</Link>

																{user?.role === 48 && (
																	<LoadingButton
																		size="small"
																		color="error"
																		variant="contained"
																		onClick={() => onRemove(row.id)}
																		loading={removeLoading === row.id}
																	>
																		حذف سند
																	</LoadingButton>
																)}
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
							count={documents.total | 0}
							rowsPerPage={rowsPerPage}
							rowsPerPageOptions={[10, 20, 40]}
							onPageChange={(_event, newPage) => fetchDocuments(newPage, rowsPerPage)}
							labelRowsPerPage={'تعداد در صفحه'}
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
const Section = tw.section`flex justify-between items-center mb-5`
