// ? utils
import { styled } from 'twin.macro'
// ? components
import Typography from '@mui/material/Typography'
import { Variant } from '@mui/material/styles/createTypography'

interface Props {
	title: string
	variant?: Variant
}
export default function AppTitleTypeA({ title, variant = 'subtitle2' }: Props) {
	return (
		<TitleWrapper>
			<Typography variant={variant} className="__app_title_type_a">
				{title}
			</Typography>
		</TitleWrapper>
	)
}

const TitleWrapper = styled.label`
	display: block;
	margin-bottom: 0.5rem;

	.__app_title_type_a::before {
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
