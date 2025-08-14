import { cn, type RCFwdDOMElement } from '@/utils/react-ext'
import { cls } from '../cls'
import { LoadingSpinner } from '../states/LoadingSpinner'

export const SolButton: RCFwdDOMElement<HTMLButtonElement, Parameters<typeof cls.btnVariants2D>[0] & { isLoading?: boolean }> = ({
	size, rounded, theme, depress, shadow, transitionDepress, transitionDuration,
	className, isLoading, ...props
}) => {

	return <button
		{...props}
		className={cn(
			cls.btnVariants2D({
				size, rounded, theme, depress, shadow, transitionDepress, transitionDuration
			}),
			className
		)}
		{...isLoading ? { disabled: true, children: <LoadingSpinner className='my-0.5' /> } : {}}
	/>

}
