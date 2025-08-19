import { format, isValid, parse } from 'date-fns'

const now = new Date()
const nowYr = now.getFullYear()
export namespace timestamps {
	export const toFmt = (yyyymmddMaybe: string) => {
		if (!yyyymmddMaybe) return ''
		const date = parse(yyyymmddMaybe, 'yyyy-MM-dd', now)
		return isValid(date) ? format(date, date.getFullYear() === nowYr ? 'EEE, d MMM' : 'd MMM yyyy') : ''
	}
}
