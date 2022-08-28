// ? react
import { useState } from 'react'
// ? utils
import tw, { styled } from 'twin.macro'
// ? components
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

type Value = string | number | boolean
interface Props {
	label: string
	disabled?: boolean
	defaultValue: Value
	onChange: (val: Value) => void
	options: { label: string; value: Value }[]
}
export default function AppSwitchButton({
	label,
	options,
	disabled,
	onChange,
	defaultValue,
}: Props) {
	const [value, setValue] = useState(defaultValue)

	function handleChange(val: Value) {
		setValue(val)
		onChange(val)
	}

	return (
		<Wrapper>
			<label>{label}</label>

			<ButtonGroup variant="outlined" className="__buttons">
				{options.map((option, i) => (
					<Button
						variant={value === option.value ? 'contained' : undefined}
						className="min-w-fit"
						key={i}
						onClick={() => handleChange(option.value)}
						disabled={disabled}
					>
						{option.label}
					</Button>
				))}
			</ButtonGroup>
		</Wrapper>
	)
}

const Wrapper = styled.div(() => [
	{ label: tw`block text-xs text-gray-600 mb-1.5` },
	`
		.__buttons {
			display: flex !important;
		}
		
		button {
			min-width: 7rem !important;
			width:100%;
		}
	`,
])
