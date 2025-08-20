import { cn, type Children } from '@/utils/react-ext'
import { AnimatePresence, motion } from 'framer-motion'

export const SolPopoverMenuSpawner: React.FC<{
	show: boolean,
	className?: string,
	style?: React.CSSProperties,
	width: number | string,
	onClose?(): void
} & Children> = ({
	show, className, width, onClose, ...props
}) => {

	return <AnimatePresence>
		{ onClose && show && <div key='backdrop' className='inset-0 fixed z-10' /> }
		{show && (
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ duration: 0.1, ease: 'easeOut' }}
				{...props}
				style={{
					width: width ?? props.style?.width,
					...props.style
				}}
				className={cn(
					'absolute right-0 z-20 top-[calc(100%+8px)] bg-white dark:bg-neutral-950 shadow-sm border border-neutral-200 flex flex-col items-stretch py-2 px-1 dark:border-neutral-800 rounded-md',
					className
				)}
			/>
		)}
	</AnimatePresence>
}
