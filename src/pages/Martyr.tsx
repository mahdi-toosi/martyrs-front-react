// ? react
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// ? utils
import tw from 'twin.macro'
import userStore from '@/stores/user'
import martyrsStore from '@/stores/martyrs'
import { useRepositories } from '@/repositories'
// ? components
import { BoxLoading } from 'react-loadingg'
import LoadingButton from '@mui/lab/LoadingButton'
import DefaultLayout from '@/components/DefaultLayout'
import MartyrSectionA from '@/components/MartyrSectionA'
import MartyrSectionBIdInfo from '@/components/MartyrSectionBIdInfo'
import MartyrSectionDOriginality from '@/components/MartyrSectionDOriginality'
import MartyrSectionCBirthPlace from '@/components/MartyrSectionCBirthPlace'
import MartyrSectionGMartyrdom from '@/components/MartyrSectionGMartyrdom'
import MartyrSectionFSacrificeInfo from '@/components/MartyrSectionFSacrificeInfo'
import MartyrSectionEFamilyStatus from '@/components/MartyrSectionEFamilyStatus'
// ? types
import type { Martyr as MartyrType } from '@/repositories/martyrs/types'
import MartyrSectionHBurialPlace from '@/components/MartyrSectionHBurialPlace'
import MartyrSectionITags from '@/components/MartyrSectionITags'
import MartyrSectionJBio from '@/components/MartyrSectionJBio'
import MartyrSectionKRelatives from '@/components/MartyrSectionKRelatives'

export default function Martyr() {
	const { id } = useParams()
	const { user } = userStore()
	const { martyr, setMartyr } = martyrsStore()
	const { martyrs: martyrsRepo } = useRepositories()

	const [fetchLoading, setFetchLoading] = useState(false)
	const [storeLoading, setStoreLoading] = useState(false)

	const onStore = async (status?: MartyrType['status']) => {
		setStoreLoading(true)

		if (status) martyr.status = status
		const result = await martyrsRepo.update(martyr)

		if (!result) {
			setStoreLoading(false)
			return
		}

		// if (selectedImage) await martyrsRepo.uploadImage(result.id, selectedImage as Blob, result.image)

		setStoreLoading(false)
	}

	const fetchMartyr = async () => {
		setFetchLoading(true)
		let result = await martyrsRepo.getById(id as string)
		setFetchLoading(false)
		if (!result) return

		result = setDefaultValues(result)

		setMartyr(result as MartyrType)
	}

	useEffect(() => {
		fetchMartyr()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (fetchLoading) return <BoxLoading color="#c5a711" />

	return (
		<DefaultLayout>
			<MartyrSectionA />

			<MartyrSectionBIdInfo />

			<MartyrSectionCBirthPlace />

			<MartyrSectionDOriginality />

			<MartyrSectionEFamilyStatus />

			<MartyrSectionFSacrificeInfo />

			<MartyrSectionGMartyrdom />

			<MartyrSectionHBurialPlace />

			<MartyrSectionITags />

			<MartyrSectionJBio />

			<MartyrSectionKRelatives />

			<FormActions dir="ltr">
				{user?.role === 3 && ['notStart', 'doing'].includes(martyr.status) && (
					<LoadingButton
						loading={storeLoading}
						variant="contained"
						onClick={() => onStore('sendForReviewer')}
					>
						ارسال برای بازبین
					</LoadingButton>
				)}

				{user?.role === 30 && martyr.status === 'sendForReviewer' && (
					<LoadingButton
						loading={storeLoading}
						variant="contained"
						onClick={() => onStore('doing')}
					>
						برگشت برای نمایه گر
					</LoadingButton>
				)}

				{user?.role === 48 && martyr.status === 'done' && (
					<LoadingButton
						loading={storeLoading}
						variant="contained"
						onClick={() => onStore('sendForReviewer')}
					>
						بازبینی مجدد
					</LoadingButton>
				)}

				{Number(user?.role) >= 30 && martyr.status === 'sendForReviewer' && (
					<LoadingButton loading={storeLoading} variant="contained" onClick={() => onStore('done')}>
						تایید نهایی
					</LoadingButton>
				)}

				{(user?.role === 48 ||
					(user?.role === 30 && martyr.status === 'sendForReviewer') ||
					(user?.role === 3 && !['sendForReviewer', 'done'].includes(martyr.status))) && (
					<LoadingButton loading={storeLoading} variant="contained" onClick={() => onStore()}>
						ذخیره تغییرات
					</LoadingButton>
				)}
			</FormActions>
		</DefaultLayout>
	)
}

const setDefaultValues = (martyr: MartyrType) => {
	if (martyr.city) {
		martyr.defaultCity = { name: martyr.city }
	}
	if (martyr.state) {
		martyr.defaultState = { name: martyr.state }
	}
	if (martyr.originality_state) {
		martyr.defaultOriginalityState = { name: martyr.originality_state }
	}
	if (martyr.originality_city) {
		martyr.defaultOriginalityCity = { name: martyr.originality_city }
	}

	if (martyr.burial_state) {
		martyr.defaultBurialState = { name: martyr.burial_state }
	}
	if (martyr.burial_city) {
		martyr.defaultBurialCity = { name: martyr.burial_city }
	}

	martyr.taxonomies_relations.forEach((t_r) => {
		const type = t_r.taxonomy?.type.trim()

		if (type === 'category') {
			if (!martyr.categories) martyr.categories = []
			martyr.categories.push(t_r)
		}
		if (type === 'tag') {
			if (!martyr.tags) martyr.tags = []
			martyr.tags.push(t_r)
		}
		if (type === 'operation') {
			if (!martyr.operations) martyr.operations = []
			martyr.operations.push(t_r)
		}
	})

	martyr.defaultTags = martyr.tags
	martyr.defaultCategories = martyr.categories
	martyr.defaultOperations = martyr.operations

	return martyr
}

// ? styles
const FormActions = tw.section`w-full flex justify-start gap-4 mt-10`
