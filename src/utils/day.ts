import dayjs from 'dayjs'
import jalaliday from 'jalaliday'

dayjs.extend(jalaliday)

export function getJalaliWrapper(date: string) {
	return dayjs(date).calendar('jalali')
}

export function jalaliDate(date?: string, format: 'date' | 'dateTime' | string = 'date') {
	if (!date) return undefined
	let f
	if (format === 'date') f = 'YYYY/MM/DD'
	else if (format === 'dateTime') f = 'HH:mm YYYY/MM/DD'

	return dayjs(date)
		.calendar('jalali')
		.format(f || format)
}

export function gregoryDate(date?: string, mode: 'date' | 'dateTime' | string = 'date') {
	if (!date) return false
	const format = mode === 'date' ? 'YYYY/MM/DD' : ' HH:mm YYYY/MM/DD'
	return dayjs(date, { jalali: true }).format(format)
}
