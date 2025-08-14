import { errLib } from '@/utils/errLib'
import { setAtom } from '@/utils/jotai-ext'
import { useAtom } from 'jotai'
import { withImmer } from 'jotai-immer'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { useEffect } from 'react'
import { loadStates, type LoadState } from './loadStates'

export namespace loaderPackE {
	export const forSingularStorePayload = <
		Q extends (...params: any[]) => Promise<any>
	>(storeName: string, queryFn: Q) => {

		const immerAtom = withImmer(atomWithStorage<LoadState<Awaited<ReturnType<Q>>>>(`alppf_alpinevillecollege:${storeName}`, loadStates.init()))

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

		const immerAtom = atomFamily((param: Parameters<Q>[0]) => withImmer(atomWithStorage<LoadState<Awaited<ReturnType<Q>>>>(`alppf_alpinevillecollege:${storeName}:${paramToID(param)}`, loadStates.init())))
		const refetch = async (params: Parameters<Q>[0]) => {
			try {
				const data = await queryFn(params)
				return setAtom(immerAtom(params[0]), loadStates.fromData(data))
			} catch (error) {
				return setAtom(immerAtom(params[0]), loadStates.fromError(errLib.logAndExtractError(error)))
			}
		}

		const useStateWithLoader = (memoisedParams: Parameters<Q>[0] | null) => {
			const [state, setState] = useAtom(immerAtom(memoisedParams))
			useEffect(() => {
				if (memoisedParams) refetch(memoisedParams)
				else if (state.loaded !== null) setState(loadStates.init())
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
