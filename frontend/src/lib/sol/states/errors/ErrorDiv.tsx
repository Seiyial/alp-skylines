import { AnimatePresence, motion } from 'framer-motion'

export const ErrorDiv: React.FC<{ err: null | undefined | string, className?: string }> = ({ className, err }) => {
	return <AnimatePresence>
		{ err && <motion.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: 'auto' }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ ease: 'easeOut', duration: 0.3 }}
			key='divl-8'
			className={`text-danger-600 mb-2 dark:text-danger-400 text-sm ${className}`}
		>
			{err}
		</motion.div> }
	</AnimatePresence>
}
