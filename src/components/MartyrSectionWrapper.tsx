// ? react
import { ReactNode } from 'react'
// ? utils
import tw, { styled } from 'twin.macro'

interface Props {
	children: ReactNode
	title: string
}
export default function MartyrSectionWrapper({ children, title }: Props) {
	return (
		<SectionWrapper>
			<TitleWrapper>{title}</TitleWrapper>

			<ElementsWrapper>{children}</ElementsWrapper>
		</SectionWrapper>
	)
}

// ? styles
const SectionWrapper = tw.section`flex flex-col md:flex-row items-center justify-center 
	md:justify-start gap-5 p-4 pb-5 border border-gray-300 rounded-xl my-4`

const ElementsWrapper = styled.div(() => [
	tw`flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-8  flex-basis[90%]`,
	{ '& > div': tw`w-72` },
])

const TitleWrapper = styled.header(() => [
	tw`relative flex-basis[10%]`,
	`&::before {
		content: '';
		position: absolute;
		top: 50%;
		right: -18px;
		border: 0;
		width: 4px;
		height: 3rem;
		border-radius: 2px;
		background-color: #c5a711;
		transform: translateY(-50%);
}
@media screen and (max-width: 768px) {
	&::before {
		width: 6rem;
		height: 4px;
		top: -17px;
		right: 50%;
		transform: translate(50%,0%);
	}
}
`,
])
