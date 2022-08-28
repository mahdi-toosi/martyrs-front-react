// ? react
import { useState } from 'react'
// ? utils
import userStore from '@/stores/user'
import martyrsStore from '@/stores/martyrs'
import { useRepositories } from '@/repositories'
// ? components
import TextField from '@mui/material/TextField'
import AppDatepicker from '@/components/AppDatepicker'
import AppAutoComplete from '@/components/AppAutoComplete'
import MartyrSectionWrapper from '@/components/MartyrSectionWrapper'
// ? types
import type { TaxonomyRelation } from '@/repositories/taxonomies/types'

export default function MartyrSectionGMartyrdom() {
	const { user } = userStore()
	const { taxonomies } = useRepositories()
	const { updateMartyr, martyr } = martyrsStore()

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
			<AppDatepicker
				label="تاریخ شهادت"
				defaultValue={martyr.dateTo}
				onChange={(e) => updateMartyr('dateTo', e)}
			/>

			<TextField
				label="محل شهادت"
				variant="standard"
				defaultValue={martyr.locTo}
				onChange={(e) => updateMartyr('locTo', e)}
			/>

			<TextField
				label="عملیات شهادت"
				variant="standard"
				defaultValue={martyr.operationTO}
				onChange={(e) => updateMartyr('operationTO', e)}
			/>

			<TextField
				label="نحوه شهادت"
				variant="standard"
				defaultValue={martyr.howTo}
				onChange={(e) => updateMartyr('howTo', e)}
			/>

			<AppAutoComplete
				multiple
				options={categories}
				className="w-full"
				fetchLoading={loading}
				label="دسته بندی"
				onSendRequest={searchInCategories}
				defaultValue={martyr.defaultCategories}
				optionLabel={(op) => op.taxonomy?.name}
				onChange={(e) => updateMartyr('categories', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
