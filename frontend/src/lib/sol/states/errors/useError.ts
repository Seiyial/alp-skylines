import { useEffect, useState } from 'react'


const useError = (timeout?: number | undefined | null) => {
	const [error, setError] = useState<string | null>(null)
	useEffect(() => {
		if (error && timeout) {
			const existingError = '' + error
			const onTimeout = () => setError((e) => (e === existingError ? null : e))
			const id = setTimeout(onTimeout, timeout)
			return () => clearTimeout(id)
		}
	}, [error])
	return [error, setError] as const
}

export default useError
