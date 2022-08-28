// ? react
import { useRef, KeyboardEvent } from 'react'
// ? components
import DatePicker, { DateObject } from 'react-multi-date-picker'
import TextField from '@mui/material/TextField'
// ? utils
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import transition from 'react-element-popper/animations/transition'
// ? styles
import 'react-multi-date-picker/styles/colors/yellow.css'
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css'
import { gregoryDate } from '@/utils/day'

interface Props {
	label: string
	disabled?: boolean
	defaultValue: string
	onChange: (gregoryDate: string) => void
}
export default function AppDatepicker({ defaultValue, label, disabled, onChange }: Props) {
	const datePickerRef = useRef()

	function handleChange(e: DateObject) {
		const jDate = `${e.year}/${e.month.number}/${e.day}`
		onChange(new Date(gregoryDate(jDate) as string).toISOString())
	}

	return (
		<>
			<DatePicker
				portal
				calendar={persian}
				locale={persian_fa}
				ref={datePickerRef}
				value={defaultValue}
				onChange={handleChange}
				animations={[transition()]}
				className="yellow bg-dark"
				calendarPosition="bottom-right"
				render={<Input label={label} disabled={disabled} />}
			/>
		</>
	)
}

interface InputProps {
	label: string
	value?: () => void
	disabled?: boolean
	openCalendar?: () => void
	handleValueChange?: () => void
}
function Input({ openCalendar, value, handleValueChange, label, disabled }: InputProps) {
	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		e.preventDefault()
	}
	return (
		<TextField
			label={label}
			value={value}
			variant="standard"
			onKeyPress={handleKeyPress}
			className="w-full"
			disabled={disabled}
			onFocus={openCalendar}
			onChange={handleValueChange}
		/>
	)
}
