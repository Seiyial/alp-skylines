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

export const projectsRouter = router({
	list
})
