import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

type Value = string | number
interface Props {
	label: string
	disabled?: boolean
	className?: string
	defaultValue?: Value
	options: { label: string; value: Value }[]
	onChange: (value: string | number) => void
}

export default function AppDropdown({
	label,
	options,
	disabled,
	onChange,
	className,
	defaultValue,
}: Props) {
	return (
		<FormControl className={className}>
			<InputLabel>{label}</InputLabel>

			<Select
				size="small"
				variant="standard"
				disabled={disabled}
				defaultValue={defaultValue}
				onChange={(e) => onChange(e.target.value)}
			>
				{options.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}
