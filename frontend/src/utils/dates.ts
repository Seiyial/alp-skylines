import { format } from 'date-fns'

export namespace dates {
	export const monthNamesLong = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	]
	export const monthNamesShort = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	]
	export const weekdayNamesSunIdxShort = [
		'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
	]
	export const monthNumToNameShort = (mthNum: number) => monthNamesShort[mthNum - 1]
	export const monthNumToNameLong = (mthNum: number) => monthNamesLong[mthNum - 1]
	export const fmt = (date: Date, to: 'd MMM yyyy' | 'yyyy-MM-dd') => {
		return format(date, to)
	}
}

export namespace dateKeys {
	export const fromDate = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
	export const from = (yyyy: string | number, mthNum: string | number, day: string | number) => `${yyyy.toString().padStart(4, '0')}-${mthNum.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}
