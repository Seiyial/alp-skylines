
// you can limit `ErrCode` into string literals to strict-type error codes.
type ErrCode = string

type ErrMsg = string

type ErrorPropDump = { at?: string[] } & { [k: string]: any }
export type ResultOk<T = undefined> = T extends undefined ? { ok: true } : { ok: true, d: T }
export type ResultFail<E extends (ErrCode | ErrMsg | undefined) = ErrCode | ErrMsg, P extends ErrorPropDump = ErrorPropDump> = E extends null ? { ok: false } : { ok: false, errCode: E, err: string, props?: P }
export type Result<T = undefined, E extends (ErrCode | ErrMsg | undefined) = ErrCode | ErrMsg, P extends ErrorPropDump = ErrorPropDump> = ResultOk<T> | ResultFail<E, P>
export type Unresult<T> = (T & { ok: true }) extends Result<infer X> ? X : never

export type PResult<T = undefined, E extends (ErrCode | ErrMsg | undefined) = ErrCode | ErrMsg, P extends ErrorPropDump = ErrorPropDump> = Promise<Result<T, E, P>>

export namespace r {
	export function ok (data?: undefined): ResultOk<undefined>
	export function ok<T> (data: T): ResultOk<T>
	export function ok (data?: any) {
		return data === undefined
			? { ok: true }
			: { ok: true, d: data }
	}
	// export const ok = <T = undefined> (data?: T): T extends undefined ? ResultOk<undefined> : ResultOk<T> => {
	// 	return data === undefined
	// 		? { ok: true } as T extends undefined ? ResultOk<undefined> : ResultOk<T>
	// 		: { ok: true, data } as T extends undefined ? ResultOk<undefined> : ResultOk<T>
	// }
	export const fail = <E extends (ErrCode | ErrMsg | undefined) = undefined> (msgAsCode?: E, props?: ErrorPropDump) => (msgAsCode === undefined
		? { ok: false, props } as ResultFail<E>
		: {
			ok: false, errCode: msgAsCode, err: msgAsCode, props
		} as ResultFail<E>)
	export const failWCode = <E extends (ErrCode | ErrMsg | undefined) = undefined> (code: E, msg: ErrMsg, props?: ErrorPropDump) => {
		return {
			ok: false, errCode: code, err: msg, props
		} as ResultFail<E>
	}
	export const fwd = <E extends (ErrCode | ErrMsg | undefined) = undefined> (result: ResultFail<E>, contextNote: string) => {
		result.props ??= {}
		result.props.at ??= []
		result.props.at.push(contextNote)
		return result
	}
	export function dropData (result: Result<unknown>): Result<undefined> {
		return result.ok ? { ok: true } : result
	}

	export function decorateToReturnResult<F extends ((...props: any[]) => any)> (
		f: F
	): ((...props: Parameters<F>) => Result<ReturnType<F>>) {
		return ((...params: Parameters<F>) => {
			try {
				const result = f(...params)
				return ok(result)
			} catch (e) {
				console.error(e)
				if (typeof e === 'object' && e && 'stack' in e) console.error(e.stack)
				if (e instanceof Error) {
					return fail(e.message)
				} else {
					return fail('an unknown error occurred')
				}
			}
		}) as ((...props: Parameters<F>) => Result<ReturnType<F>>)
	}

	export const isResult = <T> (result: unknown): result is Result<T> => {
		return Boolean((typeof result === 'object') && result && typeof (result as any).ok === 'boolean')
	}

	export async function bind<F extends (() => Promise<any>)> (
		f: F
	): Promise<Result<Awaited<ReturnType<F>>>> {
		try {
			const result = await f()
			return isResult(result) ? (result as Result<Awaited<ReturnType<F>>>) : ok(result as Awaited<ReturnType<F>>)
		} catch (e) {
			console.error(e)
			if (typeof e === 'object' && e && 'stack' in e) console.error(e.stack)
			if (e instanceof Error) {
				return fail(e.message)
			} else {
				return fail('an unknown error occurred')
			}
		}
	}
}
