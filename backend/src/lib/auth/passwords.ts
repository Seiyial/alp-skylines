import { hash, verify } from '@node-rs/argon2'

export namespace passwords {
	export const generateHash = async (password: string | Uint8Array) => {
		return hash(password)
	}
	export const compare = async (password: string, existingHash: string) => {
		return verify(existingHash, password)
	}
	export const makeNewWithHash = async () => {
		const pw = crypto.getRandomValues(new Uint8Array(20))
		return {
			password: pw.toString(),
			hash: await generateHash(pw)
		}
	}
}
