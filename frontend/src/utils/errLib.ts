
// extend as needed for project
export namespace errLib {
	export const logAndExtractError = (err: unknown, label?: string): string => {
		console.error(label ?? 'We have an error!', err)
		if (err instanceof Error) {
			return err.message
		} else if (typeof err === 'string') {
			return err
		} else if (typeof err === 'object' && err !== null && 'message' in err) {
			return (err as { message: string }).message
		}
		return 'An unknown error occurred'
	}
}
