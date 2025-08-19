import { route, router } from '@/lib/core/trpc'
import { pris } from '@/lib/db/prisma'
import { ownership } from '@/mods/ownership'
import { invariant } from '@epic-web/invariant'
import { format } from 'date-fns'
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
				yyyymmdd: format(new Date(), 'yyyy-MM-dd'),
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
			.optional(),
		writeup: z.array(z.any()).optional(), // Assuming writeup is an array of any type, adjust as necessary
		yyyymmdd: z.string().min(1)
			.regex(/^\d{4}-\d{2}-\d{2}$/)
			.optional()
	}))
	.mutation(async ({ ctx, input }) => {
		invariant(ctx.session?.user?.isSuperAdmin, 'User not found or isn\'t admin')
		const ep = await pris.episode.findUnique({ where: { id: input.id } })
		invariant(ep, 'Project not found or you don\'t have permission to modify it.')
		await ownership.ensureUserCanWriteProject(ctx.session.user, ep.projectID)
		const episode = await pris.episode.update({
			where: { id: input.id },
			data: { title: input.title, writeup: input.writeup, yyyymmdd: input.yyyymmdd }
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
