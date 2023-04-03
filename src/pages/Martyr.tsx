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
import MartyrSectionJBio from '@/components/MartyrSectionJBio'
import MartyrSectionITags from '@/components/MartyrSectionITags'
import MartyrSectionBIdInfo from '@/components/MartyrSectionBIdInfo'
import MartyrSectionKRelatives from '@/components/MartyrSectionKRelatives'
import MartyrSectionDOriginality from '@/components/MartyrSectionDOriginality'
import MartyrSectionCBirthPlace from '@/components/MartyrSectionCBirthPlace'
import MartyrSectionGMartyrdom from '@/components/MartyrSectionGMartyrdom'
import MartyrSectionHBurialPlace from '@/components/MartyrSectionHBurialPlace'
import MartyrSectionFSacrificeInfo from '@/components/MartyrSectionFSacrificeInfo'
import MartyrSectionEFamilyStatus from '@/components/MartyrSectionEFamilyStatus'
// ? types
import type { Martyr as MartyrType } from '@/repositories/martyrs/types'

export default function Martyr() {
	const { user } = userStore()
	const { martyrId } = useParams()
	const { martyrs: martyrsRepo } = useRepositories()
	const { martyr, setMartyr, updateMartyr } = martyrsStore()

	const [storeLoading, setStoreLoading] = useState(false)
	const [fetchLoading, setFetchLoading] = useState(false)

	const onStore = async (status?: MartyrType['status']) => {
		setStoreLoading(true)

		if (status) martyr.status = status
		const result = await martyrsRepo.update(martyr)

		if (!result) {
			setStoreLoading(false)
			return
		}

		if (martyr.newAvatar) {
			const avatarResult = await martyrsRepo.uploadImage(martyr.id, martyr.newAvatar, martyr.image)
			if (avatarResult) {
				updateMartyr('newAvatar', undefined)
				updateMartyr('image', avatarResult.url)
			}
		}

		setStoreLoading(false)
	}

	const fetchMartyr = async () => {
		setFetchLoading(true)
		let result = await martyrsRepo.getById(martyrId as string)
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

			<MartyrSectionKRelatives martyrId={Number(martyrId)} />

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
	const m = martyr
	if (m.city) {
		m.defaultCity = { name: m.city }
	}
	if (m.state) {
		m.defaultState = { name: m.state }
	}
	if (m.originality_state) {
		m.defaultOriginalityState = { name: m.originality_state }
	}
	if (m.originality_city) {
		m.defaultOriginalityCity = { name: m.originality_city }
	}

	if (m.burial_state) {
		m.defaultBurialState = { name: m.burial_state }
	}
	if (m.burial_city) {
		m.defaultBurialCity = { name: m.burial_city }
	}

	m.taxonomies_relations.forEach((t_r) => {
		const type = t_r.taxonomy?.type.trim()

		if (type === 'category') {
			if (!m.categories) m.categories = []
			m.categories.push(t_r)
		}
		if (type === 'tag') {
			if (!m.tags) m.tags = []
			m.tags.push(t_r)
		}
		if (type === 'operation') {
			if (!m.operations) m.operations = []
			m.operations.push(t_r)
		}
	})

	m.defaultTags = m.tags
	m.defaultCategories = m.categories
	m.defaultOperations = m.operations

	return martyr
}

// ? styles
const FormActions = tw.section`w-full flex justify-start gap-4 mt-10`
