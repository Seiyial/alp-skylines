import type { Session, User } from '@/generated/prisma'
import { pris } from '@/lib/db/prisma'
import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding'

export namespace sessions {

	export const cookieName = '__skyline_sid'

	export const onSignedIn = async (userID: string) => {
		const token = generateSessionToken()
		try {
			await createSession(token, userID)
		} catch (e) {
			console.error(e)
			return null
		}
		return token
	}

	export function generateSessionToken (): string {
		// "DO NOT USE Math.random()"
		// "Math.random() uses a pseudo-random number generator (PRNG) that derives numbers from an internal state. If an attacker knows the generator's internal state, they can predict the next number generated. This could allow them to impersonate a user or access sensitive information"
		const bytes = new Uint8Array(20)
		crypto.getRandomValues(bytes)
		const token = encodeBase32LowerCaseNoPadding(bytes)
		return token
	}

	export async function createSession (token: string, userID: string): Promise<Session> {
		const sessionID = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
		return pris.session.create({
			data: {
				id: sessionID,
				userID,
				expiresAt: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30))
			}
		})
	}

	export async function validateSessionToken (token: string): Promise<SessionValidationResult> {
		const sessionID = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
		const session = await pris.session.findUnique({
			where: { id: sessionID },
			include: { user: true }
		})
		if (session === null) {
			return null
		}
		if (Date.now() > session.expiresAt.getTime()) {
			await pris.session.delete({ where: { id: sessionID } })
			return null
		}
		if ((Date.now() + (1000 * 60 * 60 * 24 * 15)) > session.expiresAt.getTime()) {
			// session will expire in less than 15 days
			session.expiresAt = new Date(Date.now() + (1000 * 60 * 60 * 24 * 30))
			await pris.session.update({
				where: { id: sessionID },
				data: { expiresAt: session.expiresAt }
			})
		}
		const { user, ...rest } = session
		return { session: rest, user }
	}

	export async function invalidateSession (sessionId: string): Promise<void> {
		await pris.session.delete({ where: { id: sessionId } })
	}

	export type SessionValidationResult =
		| { session: Session, user: User }
		| null

}
