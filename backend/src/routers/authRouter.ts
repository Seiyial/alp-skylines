import { pick } from '@/lib/utils/lang-ext'
import { invariant } from '@epic-web/invariant'
import { z } from 'zod'
import { passwords } from '../lib/auth/passwords'
import { sessions } from '../lib/auth/sessions'
import { publicRoute, route, router } from '../lib/core/trpc'
import { pris } from '../lib/db/prisma'

const kSessionCookieName = sessions.cookieName

const login = publicRoute
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
		return pick(user, 'id', 'email', 'name', 'isSuperAdmin', 'shouldChangePassword')
	})

const logout = publicRoute
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

const getState = publicRoute
	.input(z.object({}))
	.query(async ({ ctx }) => {
		const cu = ctx.session?.user ?? null
		if (!cu) return null
		return pick(cu, 'id', 'email', 'name', 'isSuperAdmin', 'shouldChangePassword')
	})

const repass = route
	.input(z.object({
		oldpwdd: z.string().min(1),
		nwpwdd: z.string().min(12)
	}))
	.mutation(async ({ input, ctx }) => {
		invariant(ctx.session?.user, 'Not logged in')
		if (input.oldpwdd === input.nwpwdd) {
			invariant(false, 'New password must be different from existing password')
		}
		if (ctx.session.user.passwordHash) {
			const existingPasswordOk = passwords.compare(ctx.session.user.passwordHash, input.oldpwdd)
			invariant(existingPasswordOk, 'Incorrect password')
		}
		const updateResult = await pris.user.update({
			where: { id: ctx.session.user.id },
			data: {
				passwordHash: await passwords.generateHash(input.nwpwdd),
				shouldChangePassword: false
			}
		})
		return pick(updateResult, 'id', 'email', 'name', 'isSuperAdmin', 'shouldChangePassword')
	})

export const sessionRouter = router({
	login,
	logout,
	getState,
	repass
})
