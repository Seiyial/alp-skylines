import { t } from 'elysia'

export const tOK = t.Object({ status: t.Literal('success') })
export class AlpHQAPIError extends Error {

	constructor (
		public statusCode: number,
		public status: string,
		public msg: string,
		public fields?: Record<string, string>
	) {
		super(`(${statusCode}) ${status}: ${msg}`)
	}

}

export namespace resp {
	export const err = (statusCode: number, status: string, msg: string, fields?: Record<string, string>) => new AlpHQAPIError(statusCode, status, msg, fields)
	export const notAllowed = (message?: string) => err(
		405,
		'Not allowed',
		message ?? 'You are not allowed to access this resource.'
	)

	export const notFound = (message?: string) => err(
		404,
		'Not found',
		message ?? 'The requested resource was not found. It may have expired or been deleted.'
	)

	export const notYetImplemented = (featureName?: string) => err(
		501,
		'Not yet implemented',
		`This feature ${featureName ? `(${featureName}) ` : ''}is coming soon.`
	)

	export const ok = () => ({
		status: 'success' as const
	})

	export const userNotAllowedInApp = (appName?: string) => err(
		403,
		'Authorisation missing',
		`We don't have a record that you are authorised to use "${appName}". ☹️ Please contact us if this was a mistake.`
	)
}
