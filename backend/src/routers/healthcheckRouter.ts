import { elysiaRouter } from '../lib/utils/elysiaRouter'

export const healthcheckRouter = elysiaRouter('/ping')
	.get('/', (c) => {
		return 'pong'
	})
