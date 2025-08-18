import { TaskStatus } from '@/generated/prisma'
import { route, router } from '@/lib/core/trpc'
import { pris } from '@/lib/db/prisma'
import { ownership } from '@/mods/ownership'
import { invariant } from '@epic-web/invariant'
import z from 'zod'

const create = route
	.input(z.object({
		episodeID: z.string().min(1),
		title: z.string().min(1),
		description: z.string().optional(),
		orderIdx: z.number().min(0)
			.optional(),
		statusComment: z.string().optional(),
		status: z.enum(TaskStatus)
	}))
	.mutation(async ({ ctx, input }) => {
		invariant(ctx.session?.user, 'User not found')
		await ownership.ensureUserCanWriteEpisode(ctx.session.user, input.episodeID)
		const ep = await pris.episode.findUnique({
			where: { id: input.episodeID }
		})
		invariant(ep, 'Episode not found')

		await pris.task.updateMany({
			where: {
				projectID: ep.projectID,
				episodeID: input.episodeID,
				orderIdx: { gt: input.orderIdx ?? 0 }
			},
			data: { orderIdx: { increment: 1 } }
		})

		const task = await pris.task.create({
			data: {
				title: input.title,
				description: input.description,
				orderIdx: input.orderIdx ?? 0,
				projectID: ep.projectID,
				episodeID: input.episodeID,
				status: input.status,
				statusComment: input.statusComment
			}
		})

		return task
	})

const deleteTask = route
	.input(z.object({
		id: z.string().min(1)
	}))
	.mutation(async ({ ctx, input }) => {
		invariant(ctx.session?.user, 'User not found')
		const task = await pris.task.findUnique({
			where: { id: input.id }
		})
		invariant(task, 'Task not found')
		await ownership.ensureUserCanWriteEpisode(ctx.session.user, task.episodeID)
		await pris.task.delete({
			where: { id: input.id }
		})
	})

const updateDetails = route
	.input(z.object({
		id: z.string().min(1),
		title: z.string().min(1)
			.optional(),
		description: z.string().optional(),
		status: z.enum(TaskStatus),
		statusComment: z.string().nullable()
			.optional()
	}))
	.mutation(async ({ ctx, input }) => {
		invariant(ctx.session?.user, 'User not found')
		const task = await pris.task.findUnique({
			where: { id: input.id }
		})
		invariant(task, 'Task not found')
		await ownership.ensureUserCanWriteEpisode(ctx.session.user, task.episodeID)
		await pris.task.update({
			where: { id: input.id },
			data: {
				title: input.title,
				description: input.description,
				status: input.status,
				statusComment: input.statusComment
			}
		})
	})

const reorderTasks = route
	.input(z.object({
		newOrderedTaskIDs: z.array(z.string().min(1))
	}))
	.mutation(async ({ ctx, input }) => {
		invariant(ctx.session?.user, 'User not found')
		const tasks = await pris.task.findMany({
			where: { id: { in: input.newOrderedTaskIDs } }
		})
		invariant(tasks.length === input.newOrderedTaskIDs.length, 'Some tasks not found')
		await ownership.ensureUserCanWriteEpisode(ctx.session.user, tasks[0].episodeID)
		const updates = tasks.map((task, index) => pris.task.update({
			where: { id: task.id },
			data: { orderIdx: index }
		}))
		await pris.$transaction(updates)
		return true
	})

export const tasksRouter = router({
	create,
	deleteTask,
	updateDetails,
	reorderTasks
})
