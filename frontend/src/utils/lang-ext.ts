export const updateFirstWhere = <T>(arr: T[], predicate: (e: T) => boolean, update: (e: T) => void) => {
	const idx = arr.findIndex(predicate)
	if (idx !== -1) {
		update(arr[idx]!)
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

export const mapify = <
	K extends string,
	T extends { [k in K]: string } & { [otherKeys: string]: unknown }
>(
	arr: T[],
	// can directly specify string key, or a function that returns preferred key
	keyOrResolver: K | ((item: T) => string)
): Record<string, T> => {
	const map: Record<string, T> = {}
	const resolveKey = typeof keyOrResolver === 'string'
		? (item: T) => item[keyOrResolver]
		: keyOrResolver

	for (const item of arr) {
		const key = resolveKey(item)
		if (key in map) {
			console.warn('@mapify:', 'duplicate key', key, item, map[key])
		}
		map[key] = item
	}
	return map
}
