import { cn, useTextareaAutoHeightWithRef, type RCFwdDOMElement } from '@/utils/react-ext'
import { cls } from '../cls'
import { LoadingSpinner } from '../states/LoadingSpinner'

export const SolTextInputRaw: RCFwdDOMElement<HTMLInputElement, Parameters<typeof cls.textInputVariants2D>[0] & { isLoading?: boolean, onEnter?(): void }> = ({
	// size, rounded, theme, depress, shadow,
	className, isLoading, onEnter, onKeyDown, ...props
}) => {

	return <input
		{...props}
		className={cn(
			cls.textInputVariants2D({
				// size, rounded, theme, depress, shadow
			}),
			className
		)}
		onKeyDown={onKeyDown || onEnter ? (e) => {
			if (e.key === 'Enter' && onEnter) {
				e.preventDefault()
				e.stopPropagation()
				onEnter()
			}
			onKeyDown?.(e)
		} : undefined}
		{...isLoading ? { disabled: true, children: <LoadingSpinner className='my-0.5' /> } : {}}
	/>

}

export const SolTextareaInputRaw: RCFwdDOMElement<
	HTMLTextAreaElement,
	Parameters<typeof cls.textInputVariants2D>[0]
	& {
		isLoading?: boolean,
		onEnter?(): void,
		onSuperEnter?(): void,
		autoResize?: boolean | { min?: number, max?: number }
	}
> = ({
	// size, rounded, theme, depress, shadow,
	className, isLoading, onEnter, onKeyDown, onSuperEnter, autoResize, ...props
}) => {

	const _autoResize = !autoResize ? null : typeof autoResize === 'boolean' ? { min: 0, max: window.innerHeight / 2 } : autoResize
	const heightManager = useTextareaAutoHeightWithRef(...(_autoResize ? [_autoResize.min ?? 0, _autoResize.max ?? (window.innerHeight / 2)] : [0, Infinity]) as [number, number])

	return <textarea
		{...props}
		{...autoResize ? { ref: heightManager.ref } : {}}
		style={{
			...props.style
		}}
		className={cn(
			cls.textInputVariants2D({
				// size, rounded, theme, depress, shadow
			}),
			className
		)}
		onKeyDown={onKeyDown || onEnter || onSuperEnter ? (e) => {
			if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && onSuperEnter) {
				e.preventDefault()
				e.stopPropagation()
				onSuperEnter()
			} else if (e.key === 'Enter' && onEnter) {
				e.preventDefault()
				e.stopPropagation()
				onEnter()
			}
			onKeyDown?.(e)
		} : undefined}
		{...isLoading ? { disabled: true, children: <LoadingSpinner className='my-0.5' /> } : {}}
	/>

}
