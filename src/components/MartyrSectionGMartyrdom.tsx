// ? react
import { useState } from 'react'
// ? utils
import userStore from '@/stores/user'
import martyrsStore from '@/stores/martyrs'
import { useRepositories } from '@/repositories'
// ? components
import TextField from '@mui/material/TextField'
import AppDatePicker from '@/components/AppDatePicker'
import AppAutoComplete from '@/components/AppAutoComplete'
import MartyrSectionWrapper from '@/components/MartyrSectionWrapper'
// ? types
import type { TaxonomyRelation } from '@/repositories/taxonomies/types'

export default function MartyrSectionGMartyrdom() {
	const { hasPermission } = userStore()
	const { taxonomies } = useRepositories()
	const { updateMartyr, initMartyr } = martyrsStore()

	const [categories, setCategories] = useState([] as TaxonomyRelation[])
	const [loading, setLoading] = useState(false)

	const searchInCategories = async (name: string) => {
		setCategories([])

		setLoading(true)
		const result = await taxonomies.get({
			'name[$like]': `%${name}%`,
			type: 'category',
		})
		setLoading(false)
		if (!result) return
		const options = result.data.map((category) => ({ taxonomy: category }))
		setCategories(options as TaxonomyRelation[])
	}

	return (
		<MartyrSectionWrapper title="شهادت">
			<AppDatePicker
				label="تاریخ شهادت"
				defaultValue={initMartyr.dateTo}
				disabled={!hasPermission('dateTo')}
				onChange={(e) => updateMartyr('dateTo', e)}
			/>

			<TextField
				label="محل شهادت"
				variant="standard"
				defaultValue={initMartyr.locTo}
				disabled={!hasPermission('locTo')}
				onChange={(e) => updateMartyr('locTo', e)}
			/>

			<TextField
				label="عملیات شهادت"
				variant="standard"
				defaultValue={initMartyr.operationTO}
				disabled={!hasPermission('operationTO')}
				onChange={(e) => updateMartyr('operationTO', e)}
			/>

			<TextField
				label="نحوه شهادت"
				variant="standard"
				defaultValue={initMartyr.howTo}
				disabled={!hasPermission('howTo')}
				onChange={(e) => updateMartyr('howTo', e)}
			/>

			<AppAutoComplete
				multiple
				label="دسته بندی"
				className="w-full"
				options={categories}
				fetchLoading={loading}
				onSendRequest={searchInCategories}
				defaultValue={initMartyr.defaultCategories}
				optionLabel={(op) => op.taxonomy?.name}
				disabled={!hasPermission('defaultCategories')}
				onChange={(e) => updateMartyr('categories', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
