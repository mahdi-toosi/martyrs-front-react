import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

export function getJalaliWrapper() {
	return dayjs().calendar('jalali')
}

export function jalaliDate(date?: string, format: 'date' | 'dateTime' | string = 'date') {
	if (!date) return undefined
	if (format === 'date') format = 'YYYY/MM/DD'
	else if (format === 'dateTime') format = 'HH:mm YYYY/MM/DD'

	return dayjs(date).calendar('jalali').format(format)
}

export function gregoryDate(date?: string, mode: 'date' | 'dateTime' | string = 'date') {
	if (!date) return false
	const format = mode === 'date' ? 'YYYY/MM/DD' : ' HH:mm YYYY/MM/DD'
	return dayjs(date, { jalali: true }).format(format)
}
