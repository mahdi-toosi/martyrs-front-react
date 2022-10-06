// ? react
import { useState } from 'react'
// ? utils
import userStore from '@/stores/user'
import martyrsStore from '@/stores/martyrs'
import { useRepositories } from '@/repositories'
// ? components
import AppAutoComplete from '@/components/AppAutoComplete'
import MartyrSectionWrapper from '@/components/MartyrSectionWrapper'
// ? types
import type { TaxonomyRelation } from '@/repositories/taxonomies/types'

export default function MartyrSectionITags() {
	const { hasPermission } = userStore()
	const { taxonomies } = useRepositories()
	const { updateMartyr, martyr } = martyrsStore()

	const [tags, setTags] = useState([] as TaxonomyRelation[])
	const [loading, setLoading] = useState(false)

	const searchInTags = async (name: string) => {
		setTags([])

		setLoading(true)
		const result = await taxonomies.get({
			'name[$like]': `%${name}%`,
			type: 'tag',
		})
		setLoading(false)
		if (!result) return
		const options = result.data.map((tag) => ({ taxonomy: tag }))
		setTags(options as TaxonomyRelation[])
	}

	return (
		<MartyrSectionWrapper title="کلید واژه ها">
			<AppAutoComplete
				multiple
				options={tags}
				className="w-full"
				fetchLoading={loading}
				label="کلید واژه ها"
				onSendRequest={searchInTags}
				disabled={!hasPermission('tags')}
				defaultValue={martyr.defaultTags}
				optionLabel={(op) => op.taxonomy?.name}
				onChange={(e) => updateMartyr('tags', e)}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
