import type React from 'react'
import { useCallback, useEffect, useRef, useState, type SVGProps } from 'react'

export type Children = {
	children?: React.ReactNode | React.ReactNode[]
}
export type ClassName = {
	className?: string
}

export const cn = (...classNames: (string | null | undefined)[]): string => (
	classNames.reduce<string>((acc, val) => (val ? acc + ' ' + val : acc), '')
)

export const inputSelectAll = (e: React.FocusEvent<HTMLInputElement>) => {
	e.target.setSelectionRange(0, e.target.value.length)
}

export type FSetState<T> = React.Dispatch<React.SetStateAction<T>>
export type FVoid<T> = (val: T) => void
export type PropsOf<T> = T extends React.PropsWithChildren<infer P> ? P : never

type ResolveAttributesFor<E extends HTMLElement> =
	E extends HTMLTableHeaderCellElement ? React.ThHTMLAttributes<E>
	: E extends HTMLTableDataCellElement ? React.TdHTMLAttributes<E>
	: E extends HTMLTableElement ? React.TableHTMLAttributes<E>
	: E extends HTMLLIElement ? React.LiHTMLAttributes<E>
	: E extends HTMLOListElement ? React.OlHTMLAttributes<E>
	: E extends HTMLImageElement ? React.ImgHTMLAttributes<E>
	: E extends HTMLInputElement ? React.InputHTMLAttributes<E>
	: E extends HTMLTextAreaElement ? React.TextareaHTMLAttributes<E>
	: E extends HTMLAnchorElement ? React.AnchorHTMLAttributes<E>
	: React.HTMLAttributes<E>
export type PDOMElement<E extends HTMLElement> = React.DetailedHTMLProps<ResolveAttributesFor<E>, E>
export type RCFwdDOMElement<E extends HTMLElement, Extension = object, Omits extends string = never> = React.FC<Omit<PDOMElement<E>, Omits> & Extension>
export type RCFwdSVGElement<Extensions = object> = React.FC<SVGProps<SVGSVGElement> & Extensions>

export const useBackButtonHandler = (onBack: () => void) => {
	useEffect(() => {
		const handler = (e: PopStateEvent) => {
			e.preventDefault()
			onBack()
		}
		window.addEventListener('popstate', handler)
		return () => window.removeEventListener('popstate', handler)
	}, [onBack])
}

export const useInterval = (callback: () => void, delay: number) => {
	useEffect(() => {
		const id = setInterval(callback, delay)
		return () => clearInterval(id)
	}, [callback, delay])
}

/** `useEffect` but it won't run the first time. */
export const useSubsequentEffect = (callback: React.EffectCallback, deps: any[] = []) => {
	const isFirstTime = useRef<boolean>(true)
	useEffect(() => {
		if (isFirstTime.current) {
			isFirstTime.current = false
		} else return callback()
	}, deps)
}

export const useRefOfState = <T>(statefulValue: T) => {
	const ref = useRef<T>(statefulValue)
	useEffect(() => {
		ref.current = statefulValue
	}, [statefulValue])
	return ref
}

export const useIsVisibleWithExistingRef = <E extends HTMLDivElement = HTMLDivElement>(ref: React.RefObject<E>) => {
	const [isVisible, setIsVisible] = useState(false)
	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting))
		if (ref.current) observer.observe(ref.current)
		return () => {
			if (ref.current) observer.unobserve(ref.current)
		}
	}, [ref.current])
	return isVisible
}

export const useIsVisible = <E extends HTMLDivElement = HTMLDivElement>(): { ref: React.RefObject<E | null>, isVisible: boolean } => {
	const ref = useRef<E>(null)
	const [isVisible, setIsVisible] = useState(false)
	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting))
		if (ref.current) observer.observe(ref.current)
		return () => {
			if (ref.current) observer.unobserve(ref.current)
		}
	}, [ref.current])
	return { ref, isVisible }
}

export const useTextareaAutoHeight = (ref: React.RefObject<HTMLTextAreaElement>, minHeight: number, maxHeight: number = Infinity) => {
	const [height, setHeight] = useState(minHeight)

	const recalculateHeight = useCallback(() => {
		if (ref.current) {
			ref.current.style.height = 'auto'
			const newHeight = Math.min(Math.max(ref.current.scrollHeight, minHeight), maxHeight)
			setHeight(newHeight)
			ref.current.style.height = `${newHeight}px`
			// unfortunately this gets kinda buggy the moment we wanna do newlines
		}
	}, [minHeight, maxHeight, ref])

	useEffect(() => { recalculateHeight() }, [recalculateHeight])
	return height
}
export const useTextareaAutoHeightWithRef = (minHeight: number, maxHeight: number) => {
	const ref = useRef<HTMLTextAreaElement>(null)

	const recalculateHeight = useCallback(() => {
		if (ref.current) {
			ref.current.rows = 1 // well it works
			ref.current.style.height = 'auto'
			const newHeight = Math.min(Math.max(ref.current.scrollHeight, minHeight), maxHeight)
			ref.current.style.height = `${newHeight + 4}px`
			// unfortunately this gets kinda buggy the moment we wanna do newlines
		}
	}, [minHeight, maxHeight, ref])

	useEffect(() => { recalculateHeight() }, [ref.current])
	useEffect(() => {
		if (ref.current) {
			ref.current.addEventListener('input', recalculateHeight)
			return () => ref.current?.removeEventListener('input', recalculateHeight)
		}
	}, [ref.current, recalculateHeight])

	return { ref, recalculateHeight }
}

export const emptyObj = {}

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
