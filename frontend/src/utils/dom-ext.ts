import { type MouseEvent, type PointerEvent, type TouchEvent } from 'react'
import { errLib } from './errLib'

/** DOM helper functions. */
export namespace dom {
	export const disableNextRightClickPointerUp = () => {
		window.addEventListener('pointerup', (e) => e.button === 2 && cancel(e), { once: true })
	}
	export const canGoBackToSameOrigin = () => {
		return window.history.length > 1 && document.referrer.startsWith(window.location.origin)
	}
	export const only = <T extends HTMLElement>(callback: (e: MouseEvent<T, globalThis.MouseEvent> | TouchEvent<T>) => void, opts?: { button?: number }) => (e: MouseEvent<T, globalThis.MouseEvent> | TouchEvent<T>) => {
		if ('button' in e) {
			if (e.button === (opts?.button ?? 0)) {
				e.preventDefault()
				e.stopPropagation()
				callback(e)
			}
		} else {
			e.preventDefault()
			e.stopPropagation()
			callback(e)
		}
	}
	export const onlyLeftClick = <T extends HTMLElement>(callback: (e: MouseEvent<T, globalThis.MouseEvent>) => void) => (e: PointerEvent<T>) => {
		if (e.pointerType === 'mouse' && e.button === 0) {
			e.preventDefault()
			e.stopPropagation()
			callback(e)
		}
	}
	export const interceptWith = only
	export const pd = (e: { preventDefault(): void }) => e.preventDefault()
	export const cancel = (e: { preventDefault(): void, stopPropagation(): void }) => (e.preventDefault(), e.stopPropagation())

	export const withProgress = <F extends (...params: any[]) => any>(
		setIsLoading: (v: boolean) => void,
		callback: F,
	): F => (
		async (...props: Parameters<F>) => {
			setIsLoading(true)
			return callback(...props).finally(() => setIsLoading(false))
		}
	) as F

	export const procedure = <F extends (...params: any[]) => any>(
		setIsLoading: (v: boolean) => void,
		setErrMsg: (v: string | null) => void,
		callback: F,
		label?: string
	) => {
		return async (...props: Parameters<F>) => {
			setIsLoading(true)
			setErrMsg(null)
			try {
				return await callback(...props)
			} catch (err) {
				setErrMsg(errLib.logAndExtractError(err, label)) // maybe we wanna enable label
			} finally {
				setIsLoading(false)
			}
		}
	}
}
