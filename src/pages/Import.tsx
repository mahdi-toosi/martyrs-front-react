// ? react
import { ChangeEvent, useRef, useState } from 'react'
// ? utils
import toast from '@/utils/toast'
import tw, { styled } from 'twin.macro'
import axiosInstance from '@/utils/api'
import downloadFile from '@/utils/downloadFile'
// ? components
import Button from '@mui/material/Button'
import DefaultLayout from '@/components/DefaultLayout'
import AppTitleTypeA from '@/components/AppTitleTypeA'
import FolderZipIcon from '@mui/icons-material/FolderZip'

type SendFilePayload = {
	link: string
	type: keyof State
	maxSize: number
	event: ChangeEvent<HTMLInputElement>
}

interface State {
	martyrs: {
		errors?: string[]
		results?: string[]
		showResults?: boolean
		testZipUploadPercentage?: 0
	}
	documents: State['martyrs']
}
export default function Import() {
	const zipInput = useRef<null | HTMLInputElement>(null)
	const [state, setToState] = useState<State>({ martyrs: {}, documents: {} })

	const downloadExampleFile = async (type: 'documents' | 'martyrs') => {
		let link = `/examples/import ${type}.zip`
		const fileName = type === 'martyrs' ? 'نمونه شهدا' : 'نمونه اسناد'
		if (import.meta.env.NODE_ENV !== 'production') link = import.meta.env.VITE_BASE_URL + link

		const result = (await axiosInstance.get(link, {
			responseType: 'arraybuffer',
		})) as ArrayBuffer

		downloadFile(fileName, result, 'zip')
	}

	const updatePercentage = (
		type: keyof State,
		key: 'testZipUploadPercentage',
		percentage: number
	) => {
		setToState((s) => ({ ...s, [type]: { ...s[type], [key]: percentage } }))
	}

	const sendFile = async ({ event, link, maxSize, type }: SendFilePayload) => {
		if (!event.target.files || event.target.files.length === 0) return
		const zipFile = event.target.files[0]
		if (zipFile.size > maxSize) {
			toast(`حجم فایل زیپ حداکثر ${maxSize / 1e6}mb میتواند باشد`)
			return
		}

		setToState({ martyrs: {}, documents: {} })

		const formData = new FormData()
		formData.append(type, zipFile)

		await axiosInstance
			.post(link, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: (progressEvent: { loaded: number; total: number }) => {
					const percentage = (progressEvent.loaded / progressEvent.total) * 100
					updatePercentage(type, 'testZipUploadPercentage', percentage)
				},
			})
			.then(({ data }) => {
				setToState((s) => ({
					...s,
					[type]: {
						...s[type],
						showResults: true,
						results: data.result.results,
						errors: [...new Set(data.result.errors)],
					},
				}))
			})
			.catch((error) => {
				if (error.response && error.response.data.errors && error.response.status === 400) {
					setToState((s) => ({
						...s,
						[type]: {
							...s[type],
							showResults: true,
							errors: error.response.data.errors,
						},
					}))
				}
			})

		// eslint-disable-next-line no-param-reassign
		event.target.value = ''
	}

	return (
		<DefaultLayout>
			<PageWrapper>
				<section>
					<AppTitleTypeA title="وارد کردن شهدا به صورت اکسل" variant="h5" />

					<div>
						<AppTitleTypeA title="نمونه فایل" variant="subtitle1" />

						<Button
							size="small"
							variant="contained"
							className="text-white"
							onClick={() => downloadExampleFile('martyrs')}
						>
							<FolderZipIcon />
							دانلود
						</Button>
					</div>

					<div>
						<AppTitleTypeA title="اعتبار سنجی فایل اکسل" variant="subtitle1" />

						<Button
							size="small"
							variant="contained"
							className="text-white"
							onClick={() => zipInput.current?.click()}
						>
							<FolderZipIcon />
							انتخاب فایل
						</Button>

						<input
							type="file"
							accept=".zip"
							ref={zipInput}
							onChange={(event) =>
								sendFile({ type: 'martyrs', event, link: '/validateMartyrsExcel', maxSize: 5e6 })
							}
						/>
					</div>
				</section>

				<section>
					<AppTitleTypeA title="وارد کردن اسناد به صورت اکسل" variant="h5" />
				</section>
			</PageWrapper>
		</DefaultLayout>
	)
}

const PageWrapper = styled.div(() => [
	tw`flex flex-wrap items-start justify-center gap-10`,
	{
		section: tw`flex flex-col`,
		img: tw`w-20`,
		'section h5': tw`mb-4`,
		'section > div': tw`mb-8`,
		'section > div > button': tw`mr-7`,
		'section > div > button > svg': tw`ml-2`,
	},
	`
	input[type='file'] {
		display: none;
	}
	`,
])
