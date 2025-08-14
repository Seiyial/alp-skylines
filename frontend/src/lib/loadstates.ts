import { useMemo } from 'react'

export type LoadState<D> = {
	loaded: null
} | {
	loaded: true,
	data: D
} | {
	loaded: false,
	error: string,
	errorMapped?: Record<string, string>
}

export namespace loadStates {
	export const init = <D>() => ({ loaded: null }) as LoadState<D>
	export const fromData = <D>(data: D): LoadState<D> => ({ loaded: true, data })
	export const fromError = (error: string, errorMapped?: Record<string, string>): LoadState<any> => ({ loaded: false, error, errorMapped })
	export const coerceArray = <D>(state: LoadState<D[]>): D[] => state.loaded ? state.data : []
	export const fromResult = <D>(result: { ok: true, d: D } | { ok: true, d?: undefined } | { ok: false, err: string, errProps?: Record<string, any> }): LoadState<D> => (
		result.ok ? fromData(result.d) : fromError(result.err, result.errProps)
	)
}

export const useLoadStateTransform = <D, T>(state: LoadState<D>, transform: (data: D) => T): LoadState<T> => {
	return useMemo(() => {
		if (state.loaded === true) return loadStates.fromData(transform(state.data))
		return state
	}, [state])
}
