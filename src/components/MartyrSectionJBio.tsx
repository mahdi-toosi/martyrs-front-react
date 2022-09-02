// ? utils
import userStore from '@/stores/user'
import martyrsStore from '@/stores/martyrs'
// ? components
import AppTextEditor from '@/components/AppTextEditor'
import AppTitleTypeA from '@/components/AppTitleTypeA'
// ? utils
import tw, { styled } from 'twin.macro'
// ? types
import type { Martyr } from '@/repositories/martyrs/types'

const textEditors = [
	{ label: 'وصیت نامه', key: 'will' },
	{ label: 'زندگی نامه', key: 'bio' },
	{ label: 'گزیده وصیت نامه', key: 'will_excerpts' },
	{ label: 'فرازی از وصیت نامه', key: 'will_sum' },
]
export default function MartyrSectionJBio() {
	const { user } = userStore()
	const { updateMartyr, martyr } = martyrsStore()

	return (
		<ElementsWrapper>
			{textEditors.map((textEditor) => (
				<div key={textEditor.key}>
					<AppTitleTypeA title={textEditor.label} />
					<AppTextEditor
						defaultValue={martyr[textEditor.key as keyof Martyr] as string}
						onChange={(e) => updateMartyr(textEditor.key as keyof Martyr, e)}
					/>
				</div>
			))}
		</ElementsWrapper>
	)
}

// ? styles
const ElementsWrapper = styled.section(() => [
	tw`flex flex-wrap justify-center gap-4 mt-10`,
	{ '&>div': tw`md:w-2/5` },
])
