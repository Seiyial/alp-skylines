import { cn, type RCFwdDOMElement } from '@/utils/react-ext'

export const SolTextLink: RCFwdDOMElement<HTMLAnchorElement, { underline?: 'full' | 'onhover' | 'thick' }> = ({ underline: idleUnderline, ...props }) => {

	return <a
		{...props}
		className={cn(
			'text-primary-500 cursor-pointer dark:hover:text-primary-400 hover:text-primary-600 active:text-primary-700',
			'transition-colors active:translate-y-px duration-75 active:bg-primary-500/30 -mx-1 -my-px px-1 py-px rounded-md select-none',
			idleUnderline === 'full'
				? 'underline'
				: idleUnderline === 'onhover'
					? 'underline decoration-1 decoration-transparent hover:decoration-primary-600 dark:hover:decoration-primary-400 underline-offset-1'
					: idleUnderline === 'thick'
						? 'underline decoration-2 decoration-primary-600/30 hover:decoration-primary-600/50'
						: '',
			props.className
		)}
	/>
}
