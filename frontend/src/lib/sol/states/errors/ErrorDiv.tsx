import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

export const ErrorDiv: React.FC<{ err: null | undefined | string, className?: string, setErr?: React.Dispatch<React.SetStateAction<string | null>>, t?: number }> = ({
	className, err, setErr, t
}) => {
	useEffect(() => {
		if (err && setErr) {
			const timer = setTimeout(() => {
				setErr(null)
			}, t || 3000)
			return () => clearTimeout(timer)
		}
	}, [setErr, err])
	return <AnimatePresence>
		{ err && <motion.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: 'auto' }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ ease: 'easeOut', duration: 0.3 }}
			key='divl-8'
			className={`text-danger-600 mb-2 dark:text-danger-400 text-sm ${className}`}
		>
			{err.includes('\n') ? err.split('\n').map((ln, i) => <p key={i + '::::' + ln}>{ ln }</p>) : err}
		</motion.div> }
	</AnimatePresence>
}
