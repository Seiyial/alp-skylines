import { useSubsequentEffect } from '@/utils/react-ext'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
import { atomFamily } from 'jotai/utils'
import { useEffect, useMemo, useState } from 'react'
import { loadStates, type LoadState } from './loadStates'
import { type Result } from './result-flow'

declare global {
	interface Window {
		__rcExt_loaderPackR_strictModeDuplicateFetchPrevention: {
			/** if it is a payload family it will be a Set<ID>(). If singular it is a boolean specifying if it's being fetched. */
			[key: symbol]: boolean | undefined | Set<string | number>
		}
	}
}
const _createStrictModeDuplicateRequestBlockerForSingular = () => {
	const strictModeDoubleFetchPreventionSymbol = Symbol()
	return {
		/** on-request; AND also, is the request already being done */
		onWillRequestCheckIfAlreadyBeingDone: () => {
			window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention ??= {}
			if (window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention[strictModeDoubleFetchPreventionSymbol] === true) {
				console.warn('Double fetch prevention triggered.')
				return true
			} else {
				window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention[strictModeDoubleFetchPreventionSymbol] = true
			}
			return false
		},
		unblock: () => {
			window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention ??= {}
			window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention[strictModeDoubleFetchPreventionSymbol] = false
		},
		packSymbol: strictModeDoubleFetchPreventionSymbol
	}
}
const _createStrictModeDuplicateRequestBlockerForFamily = () => {
	const strictModeDoubleFetchPreventionSymbol = Symbol()
	return {
		/** on-request; AND also, is the request already being done */
		onWillRequestCheckIfAlreadyBeingDone: (id: string | number) => {
			window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention ??= {}
			window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention[strictModeDoubleFetchPreventionSymbol] ??= new Set<string | number>()
			if ((window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention[strictModeDoubleFetchPreventionSymbol] as Set<string | number>).has(id)) {
				console.warn('Double fetch prevention triggered.')
				return true
			} else {
				(window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention[strictModeDoubleFetchPreventionSymbol] as Set<string | number>).add(id)
			}
			return false
		},
		unblock: (id: string | number) => {
			window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention ??= {}
			window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention[strictModeDoubleFetchPreventionSymbol] ??= new Set<string | number>();
			(window.__rcExt_loaderPackR_strictModeDuplicateFetchPrevention[strictModeDoubleFetchPreventionSymbol] as Set<string | number>).delete(id)
		},
		packSymbol: strictModeDoubleFetchPreventionSymbol
	}
}

export namespace loaderPackR {
	/** PARAMS: input `undefined` if no params are needed and fetch should be performed. Input `null` if DO NOT wish to fetch (until params are set later). */
	export const forSingularPayload = <N extends string, R, P> (
		_name: N,
		fetcher: (params: P) => Promise<Result<R>>,
		initialParams: P | null
	) => {
		const _atom = atomWithImmer<LoadState<R>>(loadStates.init<R>())
		const dupBlocker = _createStrictModeDuplicateRequestBlockerForSingular()

		const useLoader = (loaderInputInitialParams?: P | null) => {
			const setState = useSetAtom(_atom)

			const [params, setParams] = useState<P | null>((initialParams === undefined || initialParams === null) ? (loaderInputInitialParams ?? null) : initialParams)
			useSubsequentEffect(() => setParams((initialParams === undefined || initialParams === null) ? (loaderInputInitialParams ?? null) : initialParams), [loaderInputInitialParams])
			useEffect(() => {
				if (params !== null) {
					if (dupBlocker.onWillRequestCheckIfAlreadyBeingDone()) return
					
					fetcher(params).then((result) => {
						if (!result.ok) {
							// toaster.danger(`${ result.errCode.toUpperCase() }: ${ result.msg }`)
						}
						setState(loadStates.fromResult(result)) // see comment1
					}).catch((e) => {
						// toaster.danger('Something unexpected happened.')
						console.error(e)
					}).finally(() => {
						dupBlocker.unblock()
					})
				}
			}, [params])
			const refetch = () => {
				if (params !== null) {
					if (dupBlocker.onWillRequestCheckIfAlreadyBeingDone()) return
					fetcher(params).then((result) => {
						if (!result.ok) {
							// toaster.danger(`${ result.errCode.toUpperCase() }: ${ result.msg }`)
						}
						setState(loadStates.fromResult(result)) // see comment1
					}).catch((e) => {
						// toaster.danger('Something unexpected happened.')
						console.error(e)
					}).finally(() => {
						dupBlocker.unblock()
					})
				}
			}

			return { params, setParams, refetch }
		}

		const useStateAndLoader = (loaderInputInitialParams?: P | null) => {
			const [state, setState] = useAtom(_atom)

			const [params, setParams] = useState<P | null>((initialParams === undefined || initialParams === null) ? (loaderInputInitialParams ?? null) : initialParams)
			useSubsequentEffect(() => setParams((initialParams === undefined || initialParams === null) ? (loaderInputInitialParams ?? null) : initialParams), [loaderInputInitialParams])
			useEffect(() => {
				if (params !== null) {
					if (dupBlocker.onWillRequestCheckIfAlreadyBeingDone()) return
					fetcher(params).then((result) => {
						if (!result.ok) {
							// toaster.danger(`${ result.errCode.toUpperCase() }: ${ result.msg }`)
						}
						setState(loadStates.fromResult(result)) // see comment1
					}).catch((e) => {
						// toaster.danger('Something unexpected happened.')
						console.error(e)
					}).finally(() => {
						dupBlocker.unblock()
					})
				}
			}, [params])
			const refetch = () => {
				if (params !== null) {
					if (dupBlocker.onWillRequestCheckIfAlreadyBeingDone()) return true
					fetcher(params).then((result) => {
						if (!result.ok) {
							// toaster.danger(`${ result.errCode.toUpperCase() }: ${ result.msg }`)
						}
						setState(loadStates.fromResult(result)) // see comment1
					}).catch((e) => {
						// toaster.danger('Something unexpected happened.')
						console.error(e)
					}).finally(() => {
						dupBlocker.unblock()
					})
				}
			}

			return { params, setParams, refetch, state }
		}

		const useCurrentState = () => useAtomValue(_atom)

		return {
			useLoader,
			useStateAndLoader,
			useCurrentState,
			atom: _atom
		}
	}

	/** PARAMS: input `undefined` if no params are needed and fetch should be performed. Input `null` if DO NOT wish to fetch (until params are set later). */
	export const forSingularPayloadFamily = <_N extends string, R, P, ID extends string | number> (
		fetcher: (params: P) => Promise<Result<R>>,
		idGenerator: (params?: P) => ID,
		initialParams: P | null,
	) => {
		const _atom = atomFamily((_id) => atomWithImmer<LoadState<R>>(loadStates.init<R>()))
		const dupBlocker = _createStrictModeDuplicateRequestBlockerForFamily()

		const useLoader = (loaderInputInitialParams?: P | null) => {
			const id = idGenerator((initialParams === undefined || initialParams === null) ? (loaderInputInitialParams ?? undefined) : initialParams ?? undefined)
			const setState = useSetAtom(_atom(id || null))

			const [params, setParams] = useState<P | null>(initialParams === null ? (loaderInputInitialParams ?? null) : initialParams)
			useSubsequentEffect(() => setParams(initialParams === null ? (loaderInputInitialParams ?? null) : initialParams), [loaderInputInitialParams])
			useEffect(() => {
				if (params !== null) {
					dupBlocker.onWillRequestCheckIfAlreadyBeingDone(id)
					fetcher(params).then((result) => {
						if (!result.ok) {
							// toaster.danger(`${ result.errCode.toUpperCase() }: ${ result.msg }`)
						}
						const ls = loadStates.fromResult(result)
						if (id !== null) setState(ls) // see comment1
					}).catch((e) => {
						// toaster.danger('Something unexpected happened.')
						console.error(e)
					}).finally(() => {
						dupBlocker.unblock(id)
					})
				}
			}, [params])
			const refetch = () => {
				if (params === null) return console.warn('refetch called with no params')
				if (dupBlocker.onWillRequestCheckIfAlreadyBeingDone(id)) return
				fetcher(params).then((result) => {
					if (!result.ok) {
						// toaster.danger(`${ result.errCode.toUpperCase() }: ${ result.msg }`)
					}
					setState(loadStates.fromResult(result)) // see comment1
				}).catch((e) => {
					// toaster.danger('Something unexpected happened.')
					setState(loadStates.fromError('Something unexpected happened.'))
					console.error(e)
				}).finally(() => {
					dupBlocker.unblock(id)
				})
			}

			return { params, setParams, refetch }
		}

		const useStateAndLoader = (loaderInputInitialParams?: P | null) => {
			const id = useMemo(() => idGenerator((initialParams === undefined || initialParams === null) ? (loaderInputInitialParams ?? undefined) : initialParams ?? undefined), [initialParams, loaderInputInitialParams])
			const [state, setState] = useAtom(_atom(id))

			const [params, setParams] = useState<P | null>(initialParams === null ? (loaderInputInitialParams ?? null) : initialParams)
			useSubsequentEffect(() => setParams(initialParams === null ? (loaderInputInitialParams ?? null) : initialParams), [loaderInputInitialParams])
			useEffect(() => {
				if (params !== null) {
					if (dupBlocker.onWillRequestCheckIfAlreadyBeingDone(id)) return
					fetcher(params).then((result) => {
						if (!result.ok) {
							// toaster.danger(`${ result.errCode.toUpperCase() }: ${ result.msg }`)
						}
						if (id !== null) setState(loadStates.fromResult(result)) // see comment1
					}).catch((e) => {
						// toaster.danger('Something unexpected happened.')
						console.error(e)
					}).finally(() => {
						dupBlocker.unblock(id)
					})
				}
			}, [params])
			const refetch = () => {
				if (params !== null) {
					if (dupBlocker.onWillRequestCheckIfAlreadyBeingDone(id)) return
					fetcher(params).then((result) => {
						if (!result.ok) {
							// toaster.danger(`${ result.errCode.toUpperCase() }: ${ result.msg }`)
						}
						setState(loadStates.fromResult(result)) // see comment1
					}).catch((e) => {
						// toaster.danger('Something unexpected happened.')
						console.error(e)
					}).finally(() => {
						dupBlocker.unblock(id)
					})
				}
			}

			return { params, setParams, refetch, state }
		}

		const useCurrentState = (id: ID | null) => useAtom(_atom(id))

		return {
			useLoader,
			useStateAndLoader,
			useCurrentState,
			atom: _atom
		}
	}
}

