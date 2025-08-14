import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	server: {
		CORS_WHITELISTED_ORIGINS: z.string().optional(),
		PORT: z.string().optional().default('8000'),
		DATABASE_URL: z.string(),
	},
	runtimeEnvStrict: {
		CORS_WHITELISTED_ORIGINS: process.env.CORS_WHITELISTED_ORIGINS,
		PORT: process.env.PORT,
		DATABASE_URL: process.env.DATABASE_URL,
	},
	emptyStringAsUndefined: true
})