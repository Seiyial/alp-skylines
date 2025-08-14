import { cn, type Children, type RCFwdDOMElement } from '@/utils/react-ext'
import { Drawer as Vaul } from 'vaul'


export const DrawerRoot: React.FC<Children & { open: boolean, setOpen(bool: boolean): void }> = ({ open, setOpen, children }) => {
	return <Vaul.Root open={open} onOpenChange={setOpen}>
		{ children }
	</Vaul.Root>
}

export const DrawerTrigger: RCFwdDOMElement<HTMLButtonElement> = (buttonProps) => {
	return <Vaul.Trigger {...buttonProps} />
}

export const Drawer: RCFwdDOMElement<HTMLDivElement> = (props) => {
	return <Vaul.Portal>
		<Vaul.Overlay className='fixed inset-0 z-50 bg-black/50' />
		<Vaul.Content
			{...props}
			className={cn('fixed bottom-0 left-0 right-0 rounded-t-2xl z-60 w-full max-h-[90vh] min-h-[30vh] overflow-y-auto bg-white p-4 shadow-lg mx-auto after:hidden', props.className)}
		/>
	</Vaul.Portal>
}
