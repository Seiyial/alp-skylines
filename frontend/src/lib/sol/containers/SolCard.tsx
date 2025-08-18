import { cn, type RCFwdDOMElement } from '@/utils/react-ext'
import { cls } from '../cls'

export const SolCard: RCFwdDOMElement<HTMLDivElement, Parameters<typeof cls.card>[0]> = ({
	shadow,
	borderRadius,
	depress,
	transitionDuration,
	transitionDepress,
	bg,
	padSize,
	shadowColor,
	border,
	borderColor,
	...props
}) => {

	return <div
		{...props}
		className={cn(
			cls.card({
				shadow,
				borderRadius,
				depress,
				transitionDuration,
				transitionDepress,
				bg,
				padSize,
				shadowColor,
				border,
				borderColor
			}),
			props.className
		)}
	/>
}
