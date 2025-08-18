import { route, router } from '@/lib/core/trpc'
import { pris } from '@/lib/db/prisma'
import { ownership } from '@/mods/ownership'
import { invariant } from '@epic-web/invariant'
import z from 'zod'

const list = route
	.input(z.object({ projectID: z.string().min(1) }))
	.query(async ({ ctx, input }) => {
		invariant(ctx.session?.user?.isSuperAdmin, 'User not found or isn\'t admin')
		await ownership.ensureUserCanReadProject(ctx.session.user, input.projectID)
		const episodes = await pris.episode.findMany({
			where: { projectID: input.projectID, project: { ownerID: ctx.session.user.id } },
			orderBy: {
				timestamp: 'asc'
			}
		})
		return episodes
	})

const create = route
	.input(z.object({
		projectID: z.string().min(1),
		title: z.string().min(1)
	}))
	.mutation(async ({ ctx, input }) => {
		invariant(ctx.session?.user?.isSuperAdmin, 'User not found or isn\'t admin')
		await ownership.ensureUserCanWriteProject(ctx.session.user, input.projectID)
		const episode = await pris.episode.create({
			data: {
				title: input.title,
				project: {
					connect: { id: input.projectID }
				}
			}
		})
		return episode
	})

const updateDetails = route
	.input(z.object({
		id: z.string().min(1),
		title: z.string().min(1)
	}))
	.mutation(async ({ ctx, input }) => {
		invariant(ctx.session?.user?.isSuperAdmin, 'User not found or isn\'t admin')
		const ep = await pris.episode.findUnique({ where: { id: input.id } })
		invariant(ep, 'Project not found or you don\'t have permission to modify it.')
		await ownership.ensureUserCanWriteProject(ctx.session.user, ep.projectID)
		const episode = await pris.episode.update({
			where: { id: input.id },
			data: { title: input.title }
		})
		return episode
	})


const deleteEp = route
	.input(z.object({ id: z.string().min(1) }))
	.mutation(async ({ ctx, input }) => {
		invariant(ctx.session?.user?.isSuperAdmin, 'User not found or isn\'t admin')
		const ep = await pris.episode.findUnique({ where: { id: input.id } })
		invariant(ep, 'Project not found or you don\'t have permission to modify it.')
		await ownership.ensureUserCanWriteProject(ctx.session.user, ep.projectID)
		const episode = await pris.episode.delete({
			where: { id: input.id }
		})
		return episode
	})

export const episodesRouter = router({
	list,
	create,
	updateDetails,
	deleteEp
})
