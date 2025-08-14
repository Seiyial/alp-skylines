import { toast as sonnerToast } from 'sonner'

/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
export function toast (title: string, description: string, toast: Partial<Omit<ToastProps, 'id'>> = {}) {
	return sonnerToast.custom((id) => (
		<Toast
			id={id}
			title={title}
			description={description}
			button={toast.button ? {
				label: toast.button.label,
				onClick: () => console.log('Button clicked')
			} : undefined}
		/>
	))
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast (props: ToastProps) {
	const {
		title, description, button, id
	} = props

	return (
		<div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
			<div className="flex flex-1 items-center">
				<div className="w-full">
					<p className="text-sm font-medium text-neutral-900">{title}</p>
					<p className="mt-1 text-sm text-neutral-500">{description}</p>
				</div>
			</div>
			<div className="ml-5 shrink-0 rounded-md text-sm font-medium text-primary-600 hover:text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-hidden">
				{ button ? <button
					className="rounded bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-600 hover:bg-primary-100"
					onClick={() => {
						button.onClick()
						sonnerToast.dismiss(id)
					}}
				>
					{button.label}
				</button> : null }
			</div>
		</div>
	)
}

export default function Headless () {
	return (
		<button
			className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white"
			onClick={() => {
				toast('This is a headless toast', 'You have full control of styles and jsx, while still having the animations.', {
					button: {
						label: 'Reply',
						onClick: () => sonnerToast.dismiss()
					}
				})
			}}
		>
			Render toast
		</button>
	)
}

interface ToastProps {
	id: string | number,
	title: string,
	description: string,
	button: undefined | {
		label: string,
		onClick: () => void
	}
}
