// ? utils
import userStore from '@/stores/user'
import martyrsStore from '@/stores/martyrs'
// ? components
import Typography from '@mui/material/Typography'
import AppTextEditor from '@/components/AppTextEditor'
// ? utils
import tw, { styled } from 'twin.macro'
// ? types
import type { Martyr } from '@/repositories/martyrs/types'

function Title({ title }: { title: string }) {
	return (
		<TitleWrapper>
			<Typography variant="subtitle2">{title}</Typography>
		</TitleWrapper>
	)
}

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
					<Title title={textEditor.label} />
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
