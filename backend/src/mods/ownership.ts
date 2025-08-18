import type { User } from '@/generated/prisma'
import { pris } from '@/lib/db/prisma'
import { invariant } from '@epic-web/invariant'

export namespace ownership {
	export const ensureUserCanReadProject = async (user: Pick<User, 'id' | 'isSuperAdmin'>, projectID: string) => {
		invariant(
			user.isSuperAdmin || Boolean(await pris.project.findFirst({
				where: { id: projectID, members: { some: { userID: user.id } } }
			})),
			'User does not have access to this project'
		)
	}

	export const ensureUserCanWriteProject = async (user: Pick<User, 'id' | 'isSuperAdmin'>, projectID: string) => {
		invariant(user.isSuperAdmin, 'Project not found or you don\'t have permission to modify it.')
	}

	export const ensureUserCanWriteEpisode = async (user: Pick<User, 'id' | 'isSuperAdmin'>, episodeID: string) => {
		invariant(user.isSuperAdmin, 'Episode not found or you don\'t have permission to modify it.')
	}
}
