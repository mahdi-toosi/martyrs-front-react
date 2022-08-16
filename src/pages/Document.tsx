// ? react
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { getRouteQueries } from '@/router'
import { useParams } from 'react-router-dom'
// ? utils
import { debounce } from 'lodash'
import tw, { styled } from 'twin.macro'
import userStore from '@/stores/user'
import { useRepositories } from '@/repositories'
// ? components
import Button from '@mui/material/Button'
import { BoxLoading } from 'react-loadingg'
import TextField from '@mui/material/TextField'
import TextEditor from '@/components/TextEditor'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import Autocomplete from '@mui/material/Autocomplete'
import DefaultLayout from '@/components/DefaultLayout'
import CircularProgress from '@mui/material/CircularProgress'
// ? types
import type { SingleDocument } from '@/repositories/documents/types'
import type { Taxonomy, TaxonomyRelation } from '@/repositories/taxonomies/types'

interface Props {
	title: string
}

function Title({ title }: Props) {
	return (
		<TitleWrapper>
			<Typography variant="subtitle2">{title}</Typography>
		</TitleWrapper>
	)
}

export default function Document() {
	const { id } = useParams()
	const { user } = userStore()
	const queries = getRouteQueries()
	const { documents: documentsRepo, taxonomies } = useRepositories()

	const [document, setDocument] = useState({} as SingleDocument)
	const [fetchLoading, setFetchLoading] = useState(false)
	const [storeLoading, setStoreLoading] = useState(false)

	const imageInput = useRef<null | HTMLInputElement>(null)
	const [selectedImage, setSelectedImage] = useState<undefined | Blob>()
	const [preview, setPreview] = useState<undefined | string>()

	const [tags, setTags] = useState([] as TaxonomyRelation[])
	const [cacheTags, setCacheTags] = useState([] as TaxonomyRelation[])
	const [tagOptions, setTagOptions] = useState([] as TaxonomyRelation[])
	const [openTagOptions, setOpenTagOptions] = useState(false)
	const [tagsSearchInput, setTagsSearchInput] = useState('')
	const [fetchUsersLoading, setFetchUsersLoading] = useState(false)
	const fetchTagsLoading = openTagOptions && fetchUsersLoading

	const fetchTagOptions = async (name: string) => {
		setTagOptions([])

		setFetchUsersLoading(true)
		const result = await taxonomies.get({
			'name[$like]': `%${name}%`,
			type: 'tag',
		})
		setFetchUsersLoading(false)
		if (!result) return
		const options = result.data.map((tag: Taxonomy) => ({ taxonomy: tag }))
		setTagOptions(options as TaxonomyRelation[])
	}

	const onChangeHandler = (key: keyof SingleDocument, value: ChangeEvent<{ value: string }>) => {
		setDocument((prev) => ({ ...prev, [key]: value.target.value }))
	}

	const removeRemovedTags = async () => {
		const cachedTagsRelationId = cacheTags.map((tag) => tag.relation_id)
		for (const cachedTagRelationId of cachedTagsRelationId) {
			const index = tags.findIndex((t) => t.relation_id === cachedTagRelationId)
			if (index > -1) continue
			await taxonomies.deleteRelation(cachedTagRelationId)
		}
	}

	const onSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			setSelectedImage(undefined)
			return
		}
		setSelectedImage(e.target.files[0])
	}
	useEffect(() => {
		if (!selectedImage) {
			setPreview(undefined)
			return
		}

		const objectUrl = URL.createObjectURL(selectedImage)
		setPreview(objectUrl)

		// free memory when ever this component is unmounted
		return () => URL.revokeObjectURL(objectUrl)
	}, [selectedImage])

	const onStore = async (status?: SingleDocument['status']) => {
		setStoreLoading(true)
		await removeRemovedTags()

		document.tags = tags.map((t) => (t.relation_id ? t : (t.taxonomy as Taxonomy)))
		if (status) document.status = status
		const result = await documentsRepo.update(document)

		if (!result) {
			setStoreLoading(false)
			return
		}

		if (selectedImage)
			await documentsRepo.uploadImage(result.id, selectedImage as Blob, result.image)

		setStoreLoading(false)
	}

	useEffect(() => {
		if (!tagsSearchInput.length) return
		fetchTagOptions(tagsSearchInput)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tagsSearchInput])

	const _setViewersSearchInput = (newVal: string) => setTagsSearchInput(newVal)
	const onUpdateTagsSearchInput = debounce(_setViewersSearchInput, 500)

	const showInNewTab = () => {
		window.open(
			`${import.meta.env.VITE_BASE_URL}${document.image}`,
			'targetWindow',
			`toolbar=no,
			location=no,
			status=no,
			menubar=no,
			scrollbars=yes,
			resizable=yes,
			`
		)
	}

	const fetchDocument = async () => {
		setFetchLoading(true)
		const result = await documentsRepo.getById(id as string)
		setFetchLoading(false)
		if (!result) return
		result.taxonomies_relations = (result.taxonomies_relations as TaxonomyRelation[]).map(
			(relation) => ({
				...relation,
				...relation.taxonomy,
			})
		)
		setCacheTags(result.taxonomies_relations)
		setTags(result.taxonomies_relations)
		setDocument(result as SingleDocument)
	}

	useEffect(() => {
		fetchDocument()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (fetchLoading) return <BoxLoading color="#c5a711" />

	return (
		<DefaultLayout>
			<Typography variant="h5">
				مدیریت سند شهید {queries.name} | {queries.code}
			</Typography>

			<section>
				<ElementWrapper>
					<TextField
						label="عنوان سند"
						className="w-96"
						name="title"
						variant="standard"
						defaultValue={document.title}
						onChange={(e) => onChangeHandler('title', e)}
					/>

					<TextField
						label="شماره سند"
						className="w-60"
						name="code"
						variant="standard"
						defaultValue={document.code}
						onChange={(e) => onChangeHandler('code', e)}
					/>

					<div>
						<Title title="شرح سند" />
						<TextEditor defaultValue={document.sum} onChange={(e) => onChangeHandler('sum', e)} />
					</div>

					<div>
						<Title title="توضیح سند" />
						<TextEditor
							defaultValue={document.description}
							onChange={(e) => onChangeHandler('description', e)}
						/>
					</div>

					<div>
						<Title title="متن سند" />
						<TextEditor defaultValue={document.text} onChange={(e) => onChangeHandler('text', e)} />

						<Autocomplete
							open={openTagOptions}
							className="w-full mt-12"
							multiple
							disableClearable
							size="small"
							onOpen={() => setOpenTagOptions(true)}
							onClose={() => setOpenTagOptions(false)}
							isOptionEqualToValue={(option, value) =>
								option.taxonomy?.name === value.taxonomy?.name
							}
							getOptionLabel={(option) => option.taxonomy?.name as string}
							options={tagOptions}
							loading={fetchTagsLoading}
							defaultValue={document.taxonomies_relations}
							onInputChange={(event, newVal) => onUpdateTagsSearchInput(newVal)}
							onChange={(event, newVal) => setTags(newVal)}
							loadingText="در حال جستجو..."
							noOptionsText="نتیجه ای یافت نشد"
							renderInput={(params) => (
								<TextField
									{...params}
									label="تگ ها"
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
												{fetchTagsLoading ? <CircularProgress color="inherit" size={20} /> : null}
												{params.InputProps.endAdornment}
											</>
										),
									}}
								/>
							)}
						/>
					</div>

					<ImageSection>
						<div>
							{(selectedImage || document.image) && (
								<img
									src={preview || `${import.meta.env.VITE_BASE_URL}${document.image}`}
									alt="document pic"
								/>
							)}
						</div>

						<div className="__btns">
							<Button size="small" variant="contained" onClick={() => imageInput.current?.click()}>
								{document.image ? 'تغییر عکس سند' : 'آپلود عکس سند'}
							</Button>

							{document.image && (
								<Button size="small" variant="contained" onClick={showInNewTab}>
									نمایش در تب جدید
								</Button>
							)}

							<input
								type="file"
								ref={imageInput}
								onChange={onSelectImage}
								accept="image/png,image/jpg,image/jpeg"
							/>
						</div>
					</ImageSection>

					<div></div>
				</ElementWrapper>

				<FormActions dir="ltr">
					{user?.role === 3 && ['notStart', 'doing'].includes(document.status) && (
						<LoadingButton
							loading={storeLoading}
							variant="contained"
							onClick={() => onStore('sendForReviewer')}
						>
							ارسال برای بازبین
						</LoadingButton>
					)}

					{user?.role === 30 && document.status === 'sendForReviewer' && (
						<LoadingButton
							loading={storeLoading}
							variant="contained"
							onClick={() => onStore('doing')}
						>
							برگشت برای نمایه گر
						</LoadingButton>
					)}

					{user?.role === 48 && document.status === 'done' && (
						<LoadingButton
							loading={storeLoading}
							variant="contained"
							onClick={() => onStore('sendForReviewer')}
						>
							بازبینی مجدد
						</LoadingButton>
					)}

					{Number(user?.role) >= 30 && document.status === 'sendForReviewer' && (
						<LoadingButton
							loading={storeLoading}
							variant="contained"
							onClick={() => onStore('done')}
						>
							تایید نهایی
						</LoadingButton>
					)}

					{(user?.role === 48 ||
						(user?.role === 30 && document.status === 'sendForReviewer') ||
						(user?.role === 3 && !['sendForReviewer', 'done'].includes(document.status))) && (
						<LoadingButton loading={storeLoading} variant="contained" onClick={() => onStore()}>
							ذخیره تغییرات
						</LoadingButton>
					)}
				</FormActions>
			</section>
		</DefaultLayout>
	)
}

// ? styles
// const Section = tw.section`flex justify-between items-center mb-5`
const ElementWrapper = tw.div`grid grid-cols-2 gap-x-4 gap-y-8 mt-6`
const FormActions = tw.div`w-full flex justify-start gap-4 mt-10`
const TitleWrapper = styled.label`
	display: block;
	margin-bottom: 0.5rem;

	h6::before {
		content: '';
		display: inline-block;
		border: 0;
		margin: 0 0 -1rem 0.8rem;
		width: 1rem;
		height: 1rem;
		background-color: #c5a711;
		top: 50%;
		transform: translateY(-70%);
		border-radius: 2px;
	}
`

const ImageSection = styled.div`
	input[type='file'] {
		display: none;
	}

	img {
		border-radius: 5px;
		margin: 0 auto;
	}

	.__btns {
		display: flex;
		column-gap: 2rem;
		margin-top: 1rem;
		justify-content: center;
	}
`
