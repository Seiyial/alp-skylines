import { cn } from '@/utils/react-ext'
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import React from 'react'
import { cls, variances } from '../cls'


export const SolLoadingSkeleton: React.FC<HTMLMotionProps<'div'>> = ({ className, ...props }) => {

	const isReducedMotion = useReducedMotion()

	return <motion.div
		{...props}
		className={cn(
			'bg-neutral-100 relative select-none overflow-hidden',
			'after:content-[\'_\'] after:absolute after:inset-0 after:bg-no-repeat after:animate-translate-x-fullrange after:bg-gradient-to-r after:from-neutral-100 after:via-50% after:via-neutral-200 after:to-neutral-100',
			isReducedMotion ? 'after:hidden' : 'after:block',
			variances.use(cls.borderRadius),
			className
		)}
	/>
}
