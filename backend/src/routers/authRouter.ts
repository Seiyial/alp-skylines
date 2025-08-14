import { z } from 'zod'
import { passwords } from '../lib/auth/passwords'
import { sessions } from '../lib/auth/sessions'
import { route, router } from '../lib/core/trpc'
import { pris } from '../lib/db/prisma'

const kSessionCookieName = sessions.cookieName

const login = route
	.input(z.object({
		email: z.string().email()
			.min(1),
		password: z.string().min(1)
	}))
	.mutation(async ({ input, ctx }) => {
		const user = await pris.user.findUnique({
			where: { email: input.email.toLowerCase() }
		})
		if (!user) {
			throw new Error('User not found')
		}
		const pwOk = !user.passwordHash ? false : await passwords.compare(input.password, user.passwordHash)
		if (!pwOk) {
			throw new Error('Incorrect password')
		}
		const sessionToken = sessions.generateSessionToken()
		await sessions.createSession(sessionToken, user.id)
		ctx.resHeaders.set(
			'Set-Cookie',
			`${kSessionCookieName}=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=${60 * 60 * 24 * 30}`
		)
		const {
			email, id, isSuperAdmin, createdAt
		} = user
		return {
			email,
			id,
			...isSuperAdmin ? { isSuperAdmin } : {},
			createdAt
		}
	})

const logout = route
	.mutation(async ({ ctx }) => {
		const sessionToken = ctx.cookieValueIfAny
		if (!sessionToken) {
			throw new Error('No session found')
		}
		await sessions.invalidateSession(sessionToken).catch((e) => {
			console.error('Failed to perform session invalidation', sessionToken, e)
			return null
		})
		ctx.resHeaders.set(
			'Set-Cookie',
			`${kSessionCookieName}=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0`
		)
		return true
	})

export const sessionRouter = router({
	login,
	logout
})
