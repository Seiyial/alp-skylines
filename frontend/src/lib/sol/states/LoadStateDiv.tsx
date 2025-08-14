import type { LoadState } from '@/lib/load-states'
import { cn } from '@/utils/react-ext'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { SolLoadingSkeleton } from './SolLoadingSkeleton'

export type PLoadedDivExtended<T extends object, P extends {} = {}> = {
	data: T,
	passthrough: P
}
export type PLoadedDiv<T extends object> = {
	data: T
}
export type RCLoadedDivExtended<T extends object, P extends {} = {}> = React.FC<PLoadedDivExtended<T, P>>
export type RCLoadedDiv<T extends object> = React.FC<PLoadedDiv<T>>

export type PLoadStateDivExtended<T extends object, P extends {} = {}> = {
	state: LoadState<T>,
	/** `(data: T) => <div> { data.title } </div>` */
	view: React.FC<PLoadedDivExtended<T, P>>,
	skeleton?: boolean,
	passthrough: P,
	alsoIsLoadingIf?: unknown,
	clsSkeleton?: string,
	clsLoadingSpinner?: string,
	loaderType?: 'skeleton' | 'spinner'
}
export const LoadStateDivExtended = <T extends object, P extends {} = {}> ({
	state,
	view: RenderableView,
	passthrough,
	alsoIsLoadingIf = false,
	clsSkeleton,
	clsLoadingSpinner,
	loaderType = 'skeleton'
}: PLoadStateDivExtended<T, P>) => {

	return <AnimatePresence mode='wait'>
		{ state.loaded === null || Boolean(alsoIsLoadingIf)
			? clsSkeleton || (loaderType === 'skeleton')
				? <SolLoadingSkeleton
					key='loading'
					className={cn('w-full h-[200px]', clsSkeleton)}
				/>
				: <LoadingSpinner
					key='loading'
					className={cn('text-neutral-600 size-4', clsLoadingSpinner)}
				/>
			: state.loaded === false
				? <motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2, ease: 'easeOut' }}
					className='px-4 py-2 bg-red-100 rounded-md text-red-500'
				>
					{ state.error.split(/(\\n)/g).map((v) => <p key={v}>{ v.trim() }</p>) }</motion.div>
				: <RenderableView data={state.data} passthrough={passthrough} />
		}
	</AnimatePresence>
}

export type PLoadStateDiv<T extends object> = Omit<PLoadStateDivExtended<T>, 'passthrough'>
export const LoadStateDiv = <T extends object> ({
	state,
	view: RenderableView,
	alsoIsLoadingIf = false,
	clsSkeleton,
	clsLoadingSpinner,
	loaderType = 'skeleton'
}: PLoadStateDiv<T>) => {
	return <LoadStateDivExtended<T, {}>
		state={state}
		view={RenderableView}
		alsoIsLoadingIf={alsoIsLoadingIf}
		clsSkeleton={clsSkeleton}
		clsLoadingSpinner={clsLoadingSpinner}
		loaderType={loaderType}
		passthrough={{}}
	/>
}
