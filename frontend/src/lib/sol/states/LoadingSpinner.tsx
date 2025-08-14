import { motion } from 'framer-motion'

export type PLoadingSpinner = {
	/** DO NOT USE FILL, USE CURRENTCOLOR (text-xxxx-y) as Foreground */
	className?: string,
	style?: React.CSSProperties
}
export const LoadingSpinner: React.FC<PLoadingSpinner> = ({ className, style }) => {
	return <motion.svg
		viewBox='0 0 200 200'
		className={'size-5 ' + (className ?? '')}
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		key='loadingSpinner'
		style={style}
	>
		<defs>
			<linearGradient id='spinner-secondHalf'>
				<stop offset='0%' stopOpacity='0' stopColor='currentColor' />
				<stop offset='100%' stopOpacity='0.5' stopColor='currentColor' />
			</linearGradient>
			<linearGradient id='spinner-firstHalf'>
				<stop offset='0%' stopOpacity='1' stopColor='currentColor' />
				<stop offset='100%' stopOpacity='0.5' stopColor='currentColor' />
			</linearGradient>
		</defs>

		<g strokeWidth='32'>
			<path stroke='url(#spinner-secondHalf)' d='M 16 100 A 84 84 0 0 1 184 100' />
			<path stroke='url(#spinner-firstHalf)' d='M 184 100 A 84 84 0 0 1 16 100' />

			{ /* 1deg extra path to have the round end cap */ }
			<path
				stroke='currentColor'
				strokeLinecap='round'
				d='M 16 100 A 84 84 0 0 1 16 98'
			/>
		</g>

		<animateTransform
			from='0 0 0'
			to='360 0 0'
			attributeName='transform'
			type='rotate'
			repeatCount='indefinite'
			dur='800ms'
		/>
	</motion.svg>
}
export const getLoadingSpinnerPosition = (input: HTMLInputElement | HTMLTextAreaElement | undefined | null): React.CSSProperties => {
	if (!input) return {}
	const rect = input.getBoundingClientRect()
	const textColour = input.style.color
	const spinnerMargin = rect.height * 0.2
	const spinnerDiameter = rect.height * 0.6
	return {
		position: 'fixed',
		top: `${rect.top + spinnerMargin}px`,
		left: `${rect.left + rect.width - spinnerMargin - spinnerDiameter}px`,
		width: `${spinnerDiameter}px`,
		height: `${spinnerDiameter}px`,
		color: textColour
	}
}
