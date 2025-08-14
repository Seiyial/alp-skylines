import Elysia from 'elysia'
import { AlpHQAPIError } from './resp'

export const elysiaRouter = (prefix: string) => new Elysia({ prefix })
	.error({ AlpHQAPIError })
	.onError(({ code, error }) => {
		if (code === 'AlpHQAPIError') return Response.json(
			{
				status: error.status,
				message: error.msg,
				...error.fields ? { fields: error.fields } : {}
			},
			{
				status: error.statusCode,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)
	})
