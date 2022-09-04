// ? utils
import tw, { styled, TwStyle } from 'twin.macro'
// ? components
import LinearProgress from '@mui/material/LinearProgress'

interface Props {
	value?: number
	loading?: boolean
}
export default function AppBarChart({ value = 0, loading }: Props) {
	return (
		<ChartWrapper value={value}>
			<LinearProgress variant={loading ? 'indeterminate' : 'determinate'} value={value} dir="ltr" />
		</ChartWrapper>
	)
}

const ChartWrapper = styled.div(({ value }: { value: number }) => {
	const styles = [
		tw`relative`,
		{ '.MuiLinearProgress-bar': tw`rounded-full` },
		{ '.MuiLinearProgress-root': tw`h-8 rounded-full` },
	] as (TwStyle | string)[]

	const percentage = `&::after {
		top: 50%;
		display: block;
		position: absolute;
		right: ${value / 2}%;
		content: '%${value}';
		transform: translate(50%,-50%);
	}`

	if (value) styles.push(percentage)
	return styles
})
