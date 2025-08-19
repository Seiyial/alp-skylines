import { errLib } from '@/utils/errLib'
import { setAtom } from '@/utils/jotai-ext'
import { useAtom } from 'jotai'
import { withImmer } from 'jotai-immer'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { useEffect, useMemo } from 'react'
import { loadStates, type LoadState } from './loadstates'

export namespace loaderPackE {
	export const forSingularStorePayload = <
		Q extends (...params: any[]) => Promise<any>
	>(storeName: string, queryFn: Q) => {

		const immerAtom = withImmer(atomWithStorage<LoadState<Awaited<ReturnType<Q>>>>(`alp_skyline:${storeName}`, loadStates.init()))

		const refetch = async (params: Parameters<Q>[0]) => {
			try {
				const data = await queryFn(params)
				return setAtom(immerAtom, loadStates.fromData(data))
			} catch (error) {
				return setAtom(immerAtom, loadStates.fromError(errLib.logAndExtractError(error)))
			}
		}

		const useStateWithLoader = (params: Parameters<Q>[0] | null) => {
			const [state, setState] = useAtom(immerAtom)
			useEffect(() => {
				if (params !== null) {
					refetch(params)
				} else {
					if (state.loaded !== null) setState(loadStates.init())
				}
			}, [params])
			return { state, setState, refetch }
		}

		return { immerAtom, refetch, useStateWithLoader }
	}

	export const forFamilyPayload = <
		Q extends (...params: any[]) => Promise<any>
	>(
		storeName: string,
		queryFn: Q,
		paramToID: (param: Parameters<Q>[0]) => string
	) => {

		const immerAtom = atomFamily((param: string) => withImmer(atomWithStorage<LoadState<Awaited<ReturnType<Q>>>>(`alp_skyline:${storeName}:${param}`, loadStates.init())))
		const refetch = async (params: Parameters<Q>[0]) => {
			try {
				const data = await queryFn(params)
				console.log('fetched', data)
				return loadStates.fromData(data)
			} catch (error) {
				console.log('err', error)
				return loadStates.fromError(errLib.logAndExtractError(error))
			}
		}

		const useStateWithLoader = (memoisedParams: Parameters<Q>[0] | null) => {
			const id = useMemo(() => paramToID(memoisedParams), [memoisedParams])
			const [state, setState] = useAtom(immerAtom(id))
			useEffect(() => {
				if (memoisedParams) {
					refetch(memoisedParams).then((newLS) => {
						setState(newLS)
					})
				} else if (state.loaded !== null) {
					setState(loadStates.init())
				}
			}, [memoisedParams])
			return { state, setState, refetch }
		}

		return {
			immerAtom,
			refetch,
			useStateWithLoader
		}
	}
}
