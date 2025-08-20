import { invariant } from 'framer-motion'
import { useEffect, useRef } from 'react'

const extractTranslateX = (transform: string) => {
	console.log('transform', transform)
	let str = transform
	if (str.startsWith('translateX(') && str.endsWith(')')) {
		str = str.replace('translateX(', '').replace('px)', '')
		return str ? parseFloat(str) : 0
	} else return 0
}

const _circOut = (t: number): number => Math.sqrt(1 - ((t - 1) ** 2))

export function useDragScroll<T extends HTMLElement> () {

	const ref = useRef<T>(null)
	const isDragging = useRef<boolean>(false)
	const isPointerDown = useRef<boolean>(false)

	const getCurrentOffsetX = () => {
		const el = ref.current
		if (!el) return 0
		return extractTranslateX(el.style.transform)
	}

	const animateToOffsetX = (desiredOffsetX: number, durationMS = 200) => {
		invariant(durationMS > 0 && Number.isFinite(durationMS), 'Duration must be a positive finite number')
		const el = ref.current
		if (!el) return
		const currentOffsetX = extractTranslateX(el.style.transform)
		const move = desiredOffsetX - currentOffsetX
		let start: number | null = null
		const onFrame = (tPage: number) => {
			if (start === null) {
				start = tPage
				return requestAnimationFrame(onFrame)
			}
			const t = tPage - start
			const tRatio = Math.min(t / durationMS, 1)
			const moveRatio = _circOut(tRatio)
			// WIP, the calculations need to be fixed
			const newTlX = `translateX(${currentOffsetX + (move * moveRatio)}px)`
			console.log('t', t, 'newTlX', newTlX, 'currentOffsetX', currentOffsetX, 'move', move, 'tRatio', tRatio)
			el.style.transform = newTlX
			if (t < durationMS) requestAnimationFrame(onFrame)
			else console.log('animation done')
		}
		requestAnimationFrame(onFrame)
	}

	useEffect(() => {
		const el = ref.current!
		if (!el) return

		let startX = 0
		let startLeft = 0

		const onDown = (e: PointerEvent) => {
			isPointerDown.current = true
			document.addEventListener('pointerup', () => { isPointerDown.current = false }, { once: true })
		}
		const onMove = (e: PointerEvent) => {
			if (!isDragging.current) {
				if (isPointerDown.current) {
					isDragging.current = true
					startX = e.clientX
					startLeft = el.style.transform.startsWith('translateX') ? -extractTranslateX(el.style.transform) : 0
					el.setPointerCapture(e.pointerId)
				}
			} else {
				console.log('startLeft', startLeft, 'clientX', e.clientX, 'startX', startX)
				el.style.transform = `translateX(${-(startLeft - (e.clientX - startX))}px)`
			}
		}
		const onUp = (e: PointerEvent) => {
			isDragging.current = false
			isPointerDown.current = false
			try { el.releasePointerCapture(e.pointerId) } catch {}
		}

		el.addEventListener('pointerdown', onDown)
		el.addEventListener('pointermove', onMove)
		el.addEventListener('pointerup', onUp)
		el.addEventListener('pointercancel', onUp)
		return () => {
			el.removeEventListener('pointerdown', onDown)
			el.removeEventListener('pointermove', onMove)
			el.removeEventListener('pointerup', onUp)
			el.removeEventListener('pointercancel', onUp)
		}
	}, [])



	return { draggableRef: ref, animateToOffsetX, getCurrentOffsetX }
}
