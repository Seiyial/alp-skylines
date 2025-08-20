import { cva } from 'class-variance-authority'

export const createVariance = <V extends Record<string, string>>(defaultVariant: keyof V, variants: V) => {
	return { defaultVariant, variants }
}

export namespace variances {
	/** falls back to `defaultVariant` if not available. */
	export const use = <V extends Variance<any>>({ variants, defaultVariant }: V, preferredVariant?: TVariantOpt<V> | string): string => {
		if (!preferredVariant) return variants[defaultVariant]
		if (preferredVariant in variants) {
			return variants[preferredVariant]
		} else {
			return variants[defaultVariant]
		}
	}
}

export type Variance<V extends Record<string, string>> = ReturnType<typeof createVariance<V>>
export type TVariantOpt<V extends Variance<any>> = V['defaultVariant'] | keyof V['variants']

export namespace cls {

	export const border = createVariance(
		'thin',
		{
			medium: 'border-2',
			thin: 'border'
		}
	)
	export const borderRadius = createVariance('md', {
		none: 'rounded-none',
		sharp: 'rounded-none',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		'2xl': 'rounded-2xl',
		'3xl': 'rounded-3xl',
		full: 'rounded-full'
	})
	export type TBorderRadiusOpt = TVariantOpt<typeof borderRadius>

	export const btnBorderRadius = createVariance('rrect', {
		sharp: 'rounded-none',
		rrect: 'rounded-md',
		full: 'rounded-full'
	})

	export const commonPadSizes = createVariance('md', {
		xs: 'py-px px-1',
		sm: 'py-1 px-2',
		md: 'py-2 px-4',
		lg: 'py-3 px-6'
	})
	export const commonPadSizesWithTextSize = createVariance('md', {
		xs: 'py-px px-1 text-xs',
		sm: 'py-1 px-2 text-sm',
		md: 'py-1.5 px-4 text-base',
		lg: 'py-3 px-6 text-lg'
	})

	export const btnDepressVariance = createVariance('down_2px', {
		none: 'active:translate-y-0',
		down_px: 'active:translate-y-px',
		down_2px: 'active:translate-y-0.5',
		down_right_2px: 'active:translate-x-0.5 active:translate-y-0.5'
	})

	export const shadows = createVariance('none', {
		none: 'shadow-none',
		sm: 'shadow-sm',
		depressable_md_sm: 'shadow-md active:shadow-sm',
		depressable_sm_none: 'shadow-sm active:shadow-none'
	})

	export const transitionDurations = createVariance('d150ms', {
		instant: 'duration-0',
		d75ms: 'duration-75',
		d100ms: 'duration-100',
		d120ms: 'duration-[120ms]',
		d150ms: 'duration-[150ms]',
		d200ms: 'duration-200',
		d500ms: 'duration-500'
	})

	export const btnVariants2D = cva(
		[
			'flex items-center justify-center',
			'cursor-pointer disabled:cursor-not-allowed'
		].join(' '),
		{
			variants: {
				size: commonPadSizesWithTextSize.variants,
				rounded: {
					rrect: variances.use(borderRadius),
					...borderRadius.variants
				},
				theme: {
					primary_filled: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-primary-500/10',
					primary_light: 'bg-primary-100 text-primary-700 hover:bg-primary-200 active:bg-primary-300',
					primary_transparent_to_light: 'border-transparent bg-transparent text-primary-500 hover:bg-primary-100 active:bg-primary-200',
					primary_outlined_light: 'bg-transparent border box-border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200',
					primary_outlined_lightborder: 'bg-transparent border box-border border-primary-200 text-primary-200 hover:bg-primary-100 active:bg-primary-200',
					primary_outlined_fillable: 'bg-transparent border box-border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',

					neutral_filled: 'bg-neutral-500 text-white hover:bg-neutral-600 active:bg-neutral-700 shadow-primary-500/30',
					neutral_light: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300',
					neutral_transparent_to_light: 'border-transparent bg-transparent text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200 dark:hover:bg-black/20 dark:active:bg-black/30',
					neutral_outlined_light: 'bg-transparent border box-border border-neutral-500 text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200 hover:dark:bg-black/20 active:dark:bg-black/30',
					neutral_outlined_lightborder: 'bg-transparent border box-border border-neutral-200 text-neutral-200 hover:bg-neutral-100 active:bg-neutral-200',
					neutral_outlined_fillable: 'bg-transparent border box-border border-neutral-500 text-neutral-500 hover:bg-neutral-500 hover:text-white',

					success_filled: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-primary-500/30',
					success_light: 'bg-success-100 text-success-700 hover:bg-success-200 active:bg-success-300',
					success_transparent_to_light: 'bg-transparent text-success-500 hover:bg-success-100 active:bg-success-200',
					success_outlined_light: 'bg-transparent border box-border border-success-500 text-success-500 hover:bg-success-100 active:bg-success-200',
					success_outlined_lightborder: 'bg-transparent border box-border border-success-200 text-success-200 hover:bg-success-100 active:bg-success-200',
					success_outlined_fillable: 'bg-transparent border box-border border-success-500 text-success-500 hover:bg-success-500 hover:text-white',

					danger_filled: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 shadow-primary-500/30',
					danger_light: 'bg-danger-100 text-danger-700 hover:bg-danger-200 active:bg-danger-300',
					danger_transparent_to_light: 'border-transparent bg-transparent text-danger-500 hover:bg-danger-100 active:bg-danger-200',
					danger_outlined_light: 'bg-transparent border box-border border-danger-500 text-danger-500 hover:bg-danger-100 active:bg-danger-200',
					danger_outlined_lightborder: 'bg-transparent border box-border border-danger-200 text-danger-200 hover:bg-danger-100 active:bg-danger-200',
					danger_outlined_fillable: 'bg-transparent border box-border border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white',

					warning_filled: 'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 shadow-primary-500/30',
					warning_light: 'bg-warning-100 text-warning-700 hover:bg-warning-200 active:bg-warning-300',
					warning_transparent_to_light: 'border-transparent bg-transparent text-warning-500 hover:bg-warning-100 active:bg-warning-200',
					warning_outlined_light: 'bg-transparent border box-border border-warning-500 text-warning-500 hover:bg-warning-100 active:bg-warning-200',
					warning_outlined_lightborder: 'bg-transparent border box-border border-warning-200 text-warning-200 hover:bg-warning-100 active:bg-warning-200',
					warning_outlined_fillable: 'bg-transparent border box-border border-warning-500 text-warning-500 hover:bg-warning-500 hover:text-white'
				},
				depress: btnDepressVariance.variants,
				shadow: shadows.variants,
				transitionDepress: {
					yes: 'transition-all',
					instant: 'transition-colors'
				},
				transitionDuration: transitionDurations.variants,
				ring: {
					pri_when_focus_only: 'outline-0 focus-visible:ring-offset-2 ring-offset-neutral-50 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:active:ring-0'
				}
			},
			defaultVariants: {
				size: 'md',
				theme: 'primary_filled',
				rounded: 'rrect',
				transitionDepress: 'instant',
				depress: 'down_px',
				transitionDuration: 'd75ms',
				shadow: 'depressable_sm_none',
				ring: 'pri_when_focus_only'
			}
		}
	)

	export const textInputVariants2D = cva(
		// change as it goes
		'py-1.5 px-4 rounded-md outline-none transition-colors duration-100',
		{
			variants: {
				bg: {
					none: '',
					dark: 'dark:bg-black/20',
					darkFocusing: 'bg-transparent hover:bg-neutral-100 focus:bg-neutral-200/80 hover:focus:bg-neutral-200/80 dark:hover:bg-black/10 dark:focus:bg-black/20 dark:hover:focus:bg-black/20'
				},
				borderThickness: {
					thin: 'border',
					medium: 'border-2',
					mediumThick: 'border-[3px]',
					thick: 'border-4'
				},
				borderColour: {
					none: 'border-transparent',
					neutral: 'border-neutral-200 dark:border-neutral-900 focus:border-neutral-500 hover:focus:border-neutral-500 focus:dark:border-neutral-600 hover:dark:border-neutral-700 hover:focus:dark:border-neutral-600',
					neutralToPri: 'border-neutral-200 focus:border-primary-600 dark:border-neutral-800 focus:dark:border-primary-600 hover:dark:border-neutral-700 hover:focus:dark:border-primary-600 hover:border-neutral-400'
				},
				textColour: {
					neutral: 'text-neutral-900/95 dark:text-neutral-300 placeholder:text-neutral-900/50 dark:placeholder:text-neutral-300/30'
				}
			},
			defaultVariants: {
				borderThickness: 'thin',
				borderColour: 'neutral',
				textColour: 'neutral',
				bg: 'none'
			}
		}
	)

	export const appFooter = createVariance(
		'on_image',
		{
			on_image: 'absolute bottom-0 left-0 right-0 p-4 w-full bg-white/90 shadow-lg shadow-black backdrop-blur-sm flex items-center justify-center z-10',
			full_white: 'absolute bottom-0 left-0 right-0 p-4 w-full bg-white flex items-center justify-center z-10'
		}
	)

	export const card = cva(
		'',
		{
			variants: {
				shadow: {
					none: 'shadow-none',
					sm: 'shadow-sm',
					md: 'shadow-md',
					lg: 'shadow-lg',
					xl: 'shadow-xl'
				},
				shadowColor: {
					black: 'shadow-black/20 dark:shadow-black/20'
				},
				borderRadius: borderRadius.variants,
				depress: btnDepressVariance.variants,
				transitionDuration: transitionDurations.variants,
				transitionDepress: {
					yes: 'transition-all',
					instant: 'transition-colors'
				},
				bg: {
					none: '',
					base: 'bg-white dark:bg-neutral-900/50',
					base_darker: 'bg-neutral-50 dark:bg-black/20',
					light: 'bg-neutral-100',
					primary: 'bg-primary-500 text-white',
					primary_light: 'bg-primary-100 text-primary-700',
					primary_outlined_light: 'bg-transparent border-2 box-border border-primary-500 text-primary-500 hover:bg-primary-100 active:bg-primary-200'
				},
				padSize: commonPadSizes.variants,
				border: {
					none: 'border-none',
					thin: 'border',
					medium: 'border-2',
					medium_thick: 'border-[3px]',
					thick: 'border-4'
				},
				borderColor: {
					none: 'border-transparent',
					neutral: 'border-neutral-200 dark:border-neutral-900',
					neutral_light: 'border-neutral-200/50 dark:border-neutral-900/50',
					primary: 'border-primary-500'
				}
			},
			defaultVariants: {
				shadow: 'sm',
				shadowColor: 'black',
				borderRadius: borderRadius.defaultVariant,
				depress: 'none',
				bg: 'base',
				padSize: 'md',
				border: 'none',
				borderColor: 'neutral'
			},
			compoundVariants: []
		}
	)
}
