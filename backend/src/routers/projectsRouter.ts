import { route, router } from '@/lib/core/trpc'
import { pris } from '@/lib/db/prisma'
import { invariant } from '@epic-web/invariant'
import z from 'zod'

const list = route
	.input(z.object({}))
	.query(async ({ ctx, input }) => {
		invariant(ctx.session?.user.id, 'User not authenticated')
		return pris.project.findMany({
			where: {
				OR: [
					{ members: { some: { userID: ctx.session.user.id } } },
					{ ownerID: ctx.session.user.id }
				]
			}
		})
	})

const get = route
	.input(z.object({
		id: z.string().min(1)
	}))
	.query(async ({ ctx, input }) => {
		invariant(ctx.session?.user.id, 'User not authenticated')
		return pris.project.findUnique({
			where: {
				id: input.id,
				OR: [
					{ members: { some: { userID: ctx.session.user.id } } },
					{ ownerID: ctx.session.user.id }
				]
			}
		})
	})

const getComplete = route
	.input(z.object({
		id: z.string().min(1)
	}))
	.query(async ({ ctx, input }) => {
		invariant(ctx.session?.user.id, 'User not authenticated')
		const result = await pris.project.findUniqueOrThrow({
			where: {
				id: input.id,
				...ctx.session.user.isSuperAdmin ? {} : {
					OR: [
						{ members: { some: { userID: ctx.session.user.id } } },
						{ ownerID: ctx.session.user.id }
					]
				}
			},
			include: {
				episodes: {
					orderBy: {
						timestamp: 'asc'
					},
					include: {
						tasks: {
							orderBy: {
								orderIdx: 'asc'
							}
						}
					}
				}
			}
		})
		return { ...result, printedAt: new Date() }
	})

const create = route
	.input(z.object({
		name: z.string().min(1),
		externalName: z.string().min(1),
		description: z.string().min(1)
			.optional(),
		codename: z.string().min(1)
	}))
	.mutation(async ({ ctx, input }) => {
		invariant(ctx.session?.user.isSuperAdmin, 'You are not authorised to perform this action.')
		return pris.project.create({
			data: {
				name: input.name,
				externalName: input.externalName,
				description: input.description,
				codename: input.codename,
				ownerID: ctx.session.user.id
			}
		})
	})

const update = route
	.input(z.object({
		id: z.string().min(1),
		name: z.string().min(1)
			.optional(),
		externalName: z.string().min(1)
			.optional(),
		description: z.string().min(1)
			.optional(),
		codename: z.string().min(1)
			.optional()
	}))
	.mutation(async ({ ctx, input }) => {
		invariant(ctx.session?.user.isSuperAdmin, 'You are not authorised to perform this action.')
		return pris.project.update({
			where: {
				id: input.id
			},
			data: {
				name: input.name,
				externalName: input.externalName,
				description: input.description,
				codename: input.codename
			}
		})
	})

export const projectsRouter = router({
	list,
	get,
	getComplete,
	create,
	update
})
