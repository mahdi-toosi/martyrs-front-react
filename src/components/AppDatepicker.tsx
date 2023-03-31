// ? react
import { useRef, KeyboardEvent, useState, useEffect } from 'react'
// ? components
import DatePicker, { DateObject } from 'react-multi-date-picker'
import TextField from '@mui/material/TextField'
// ? utils
import { gregoryDate, jalaliDate } from '@/utils/day'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import transition from 'react-element-popper/animations/transition'
// ? styles
import 'react-multi-date-picker/styles/colors/yellow.css'
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css'

interface Props {
	label: string
	range?: boolean
	maxDate?: string
	disabled?: boolean
	defaultValue?: string | string[]
	onChange: (gregoryDate: string | string[]) => void
}
export default function AppDatePicker({
	range,
	label,
	disabled,
	maxDate,
	onChange,
	defaultValue,
}: Props) {
	const datePickerRef = useRef()
	const [currectDefaultValue, setCurrectDefaultValue] = useState<string | string[]>()

	useEffect(() => {
		if (range && defaultValue) {
			const dates = [] as string[]
			;(defaultValue as string[]).forEach((d) => {
				dates.push(jalaliDate(d) as string)
			})

			setCurrectDefaultValue(dates)
		} else {
			setCurrectDefaultValue(defaultValue)
		}
	}, [defaultValue, range])

	function handleChange(e: DateObject | DateObject[]) {
		if (range) {
			const dates = e as DateObject[]
			const GDates = [] as string[]

			dates.forEach((d) => {
				const JDate = `${d.year}-${d.month.number}-${d.day}`
				GDates.push(gregoryDate(JDate, 'YYYY-MM-DD') as string)
			})

			onChange(GDates)
		} else {
			const d = e as DateObject
			const JDate = `${d.year}-${d.month.number}-${d.day}`
			onChange(gregoryDate(JDate, 'YYYY-MM-DD') as string)
		}
	}

	return (
		<DatePicker
			portal
			range={range}
			calendar={persian}
			locale={persian_fa}
			ref={datePickerRef}
			maxDate={maxDate}
			value={currectDefaultValue}
			onChange={handleChange}
			className="yellow bg-dark"
			calendarPosition="bottom-right"
			animations={range ? undefined : [transition()]}
			render={<Input label={label} disabled={disabled} />}
		/>
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
			autoComplete="off"
			disabled={disabled}
			onFocus={openCalendar}
			onKeyPress={handleKeyPress}
			onChange={handleValueChange}
			className="__datepicker_input_wrapper"
		/>
	)
}
