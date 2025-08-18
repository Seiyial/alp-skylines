import { pris } from '@/lib/db/prisma'
import { intro, isCancel, outro, select, spinner, text } from '@clack/prompts'

async function main () {
	intro('Create a new project')

	const owners = await pris.user.findMany({
		where: { isSuperAdmin: true }
	})

	console.log('Available owners:\n')
	owners.forEach((owner) => {
		console.log(`> ${owner.email}`)
	})

	const owner = await select({ message: 'Choose the owner:', options: owners.map((owner) => ({ value: owner, label: (owner.email ?? '(no email)') + ' ' + `(${owner.id})`, hint: undefined })) })
	if (isCancel(owner)) return outro('Operation cancelled.')

	const name = await text({ message: 'Enter the project internal name:' })
	if (isCancel(name)) return outro('Operation cancelled.')

	const codename = await text({ message: 'Enter the project codename (short):' })
	if (isCancel(codename)) return outro('Operation cancelled.')

	const externalName = await text({ message: 'Enter the project external name (long):' })
	if (isCancel(externalName)) return outro('Operation cancelled.')

	const s = spinner()
	s.start('Creating project...')

	try {
		const project = await pris.project.create({
			data: {
				name,
				codename,
				externalName,
				owner: {
					connect: { id: owner.id }
				}
			}
		})

		s.stop('Project created successfully!')
		console.log('Project:', project)

	} catch (error) {
		s.stop('Failed to create project.')
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
