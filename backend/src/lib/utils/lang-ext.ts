export const updateFirstWhere = <T>(arr: T[], predicate: (e: T) => boolean, update: (e: T) => void) => {
	const idx = arr.findIndex(predicate)
	if (idx !== -1) {
		update(arr[idx])
	} else {
		console.warn('@updateFirstWhere', arr, 'fit not found')
	}
}
export const removeFirstWhere = <T>(arr: T[], predicate: (e: T) => boolean) => {
	const idx = arr.findIndex(predicate)
	if (idx !== -1) {
		arr.splice(idx, 1)
	} else {
		console.warn('@removeFirstWhere', arr, 'fit not found')
	}
}

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
/** await time(300) sounds nicer than await wait(300) */
export const time = wait

export const capitalise = (str: string) => (str[0]?.toUpperCase() ?? '') + str.slice(1)

export const pick = <T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> => {
	const result = {} as Pick<T, K>
	for (const key of keys) {
		if (key in obj) {
			result[key] = obj[key]
		}
	}
	return result
}
