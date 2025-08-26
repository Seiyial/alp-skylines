
// extend as needed for project
export namespace errLib {
	export const logAndExtractError = (err: unknown, label?: string): string => {
		console.error(label ?? 'We have an error!', err)
		if (err instanceof Error) {
			if (typeof err.message === 'string' && err.name === 'TRPCClientError') {
				try {
					const json = JSON.parse(err.message)
					if (Array.isArray(json)) {
						const errorList = tryCompileTRPCZodErrorList(json)
						if (errorList.length > 0) {
							return errorList.join(',\n')
						}
					} else {
						console.log(json)
					}
				} catch (e) {
					console.warn('could not parse json string in TRPCClientError')
				}
			}
			return err.message
		} else if (typeof err === 'string') {
			console.log('string err', err)
			return err
		} else if (typeof err === 'object' && err !== null && 'message' in err) {
			return (err as { message: string }).message
		}
		return 'An unknown error occurred'
	}

	const tryCompileTRPCZodErrorList = (zodErrorList: unknown[]) => {
		const errors: string[] = []
		for (const e of zodErrorList) {
			let path: string | null = null
			if (typeof e === 'object' && e && 'path' in e && Array.isArray(e.path) && e.path.every((p) => typeof p === 'string')) {
				path = e.path.join(' > ')
			}

			let message: string | null = null
			if (typeof e === 'object' && e && 'message' in e && typeof e.message === 'string') {
				message = e.message
					.replace('string', 'input')
			}
			if (path || message) {
				errors.push(`${path ? path + ': ' : ''}${message || 'something went wrong'}`)
			}
		}
		return errors
	}
}
