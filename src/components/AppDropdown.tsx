import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

type Value = string | number
interface Props {
	label: string
	className?: string
	defaultValue?: Value
	options: { label: string; value: Value }[]
	onChange: (value: string | number) => void
}

export default function AppDropdown({ label, defaultValue, onChange, options, className }: Props) {
	return (
		<FormControl className={className}>
			<InputLabel>{label}</InputLabel>

			<Select
				defaultValue={defaultValue}
				size="small"
				variant="standard"
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
