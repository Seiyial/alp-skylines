import { cn, type RCFwdDOMElement } from '@/utils/react-ext'
import type { ReactNode, RefObject } from 'react'
import ReactDOM from 'react-dom'

export const WriterButton: RCFwdDOMElement<HTMLSpanElement, { fwdRef?: RefObject<HTMLSpanElement>, active?: boolean, reversed?: boolean }> = ({
	fwdRef, reversed, className, active, ...props
}) => (
	<span
		{...props}
		ref={fwdRef}
		className={cn(
			'cursor-pointer p-2 inline-block rounded-md',
			'transition-all',
			reversed ? 'text-white' : 'text-neutral-700',
			active
				? 'bg-neutral-500/10 dark:bg-neutral-500/5'
				: 'bg-transparent hover:bg-neutral-500/20 hover:dark:bg-black/20 hover:dark:text-neutral-300',
			className
		)}
	/>
)

export const WriterIcon: RCFwdDOMElement<HTMLSpanElement, { fwdRef?: RefObject<HTMLSpanElement> }> = ({ fwdRef, className, ...props }) => (
	<span
		{...props}
		ref={fwdRef}
		className={cn(
			'material-icons',
			className,
			'text-base align-bottom'
		)}
	/>
)

export const WriterInstruction: RCFwdDOMElement<HTMLDivElement, { fwdRef?: RefObject<HTMLDivElement> }> = ({
	fwdRef, className, ...props
}) => (
	<div
		{...props}
		ref={fwdRef}
		className={cn(
			'whitespace-pre-wrap mt-0 -mr-[20px] -ml-[20px] mb-[10px] py-[10px] px-[20px] bg-warning-100',
			className
		)}
	/>
)

export const WriterToolbar: RCFwdDOMElement<HTMLDivElement, { fwdRef?: RefObject<HTMLDivElement> }> = ({
	fwdRef, className, children, ...props
}) => (
	<div
		{...props}
		ref={fwdRef}
		className={cn(
			'relative py-1 px-2 group/toolbar bg-neutral-100 dark:bg-transparent rounded-t-md border-neutral-200',
			// 'transition-colors group-hover/writer:dark:bg-black/20 hover:dark:bg-black/20',
			'flex items-end flex-wrap justify-start',
			'transition-all',
			'group-focus-within/writer:h-[38px] h-0',
			'opacity-0 group-focus-within/writer:opacity-100',
			'pointer-events-none group-focus-within/writer:pointer-events-auto',
			className
		)}
	>
		{children}
	</div>
)

export const Portal = ({ children }: { children?: ReactNode }) => {
	return typeof document === 'object'
		? ReactDOM.createPortal(children, document.body)
		: null
}

