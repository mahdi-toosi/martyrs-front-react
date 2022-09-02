// ? utils
import { styled } from 'twin.macro'
// ? components
import Typography from '@mui/material/Typography'

export default function AppTitleTypeA({ title }: { title: string }) {
	return (
		<TitleWrapper>
			<Typography variant="subtitle2">{title}</Typography>
		</TitleWrapper>
	)
}

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
