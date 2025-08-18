import { passwords } from '@/lib/auth/passwords'
import { pris } from '@/lib/db/prisma'
import { intro, isCancel, multiselect, outro, spinner, text } from '@clack/prompts'

async function main () {
	intro('Create a new user')

	const email = await text({ message: 'Enter the user email:' })
	if (isCancel(email)) return outro('Operation cancelled.')

	const name = await text({ message: 'Enter the user name:' })
	if (isCancel(name)) return outro('Operation cancelled.')

	const password = await text({ message: 'Enter the user password:' })
	if (isCancel(password)) return outro('Operation cancelled.')

	const projects = await pris.project.findMany({ orderBy: { createdAt: 'desc' } })

	const linkProjects = await multiselect({
		message: 'Select a project (or multiple) to link the user to:',
		options: projects.map((project) => ({
			value: project,
			label: project.name
		}))
	})
	if (isCancel(linkProjects)) return outro('Operation cancelled.')
	if (!linkProjects.length) {
		outro('No project selected, user will not be linked to any project.')
	}
	const s = spinner()
	s.start('Creating user...')

	try {
		const passwordHash = await passwords.generateHash(password)
		const user = await pris.user.create({
			data: {
				name,
				email,
				passwordHash,
				isSuperAdmin: false,
				memberships: {
					createMany: {
						data: linkProjects.map((project) => ({
							projectID: project.id
						}))
					}
				}
			}
		})

		s.stop('User created successfully!')
		console.log('User:', user)
	} catch (error) {
		s.stop('Failed to create user.')
		console.error(error)
	} finally {
		await pris.$disconnect()
	}

	outro('Done.')
}

main().catch((error) => {
	console.error('An unexpected error occurred:', error)
	process.exit(1)
})
