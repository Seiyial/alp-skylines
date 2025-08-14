export namespace alpHQClientLib {
	export const cookieName = '__alp_hq_sid'

	export const parseCookieFromFetchReqStruct = (fetchReqStruct: Request): string | null => {
		const cookie = fetchReqStruct.headers.get('cookie')
		if (!cookie) return null
		const cookieParts = cookie.split(';')
		for (const part of cookieParts) {
			const [name, value] = part.split('=')
			if (name.trim() === cookieName) {
				return value
			}
		}
		return null
	}
}
