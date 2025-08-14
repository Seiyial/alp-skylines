import { cn, type RCFwdDOMElement } from '@/utils/react-ext'

export const ProjectHeader: RCFwdDOMElement<HTMLDivElement> = (props) => {



	return <>
		<div {...props} className={cn('px-4 py-2', props.className)}>

			<h2 className='text-2xl text-neutral-950 dark:text-neutral-200'>
				CoVAA-Ladder Project
				<div className='w-2 inline-block shrink-0' />
				<span className='text-xs font-mono font-medium dark:text-neutral-300/80 text-neutral-500/80'>(ELIZ2)
				</span>
			</h2>
		</div>
	</>
}
