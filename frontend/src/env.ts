import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	clientPrefix: 'FRONTEND_PUBLIC_',
	client: {
		FRONTEND_PUBLIC_API_URL: z.string().optional(),
	},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true
})