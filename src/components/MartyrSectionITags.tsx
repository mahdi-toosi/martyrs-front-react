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
	const { updateMartyr, initMartyr } = martyrsStore()

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
				label="کلید واژه ها"
				className="w-full"
				fetchLoading={loading}
				onSendRequest={searchInTags}
				disabled={!hasPermission('tags')}
				defaultValue={initMartyr.defaultTags}
				onChange={(e) => updateMartyr('tags', e)}
				optionLabel={(op) => op.taxonomy?.name}
			/>
		</MartyrSectionWrapper>
	)
}

// ? styles
