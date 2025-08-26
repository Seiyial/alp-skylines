import { passwords } from '@/lib/auth/passwords'
import { pris } from '@/lib/db/prisma'
import {
	intro, isCancel, outro, spinner, text
} from '@clack/prompts'

async function main () {
	intro('Create a new user')

	const email = await text({ message: 'Enter the user email:' })
	if (isCancel(email)) return outro('Operation cancelled.')

	const name = await text({ message: 'Enter the user name:' })
	if (isCancel(name)) return outro('Operation cancelled.')

	const password = await text({ message: 'Enter the user password:' })
	if (isCancel(password)) return outro('Operation cancelled.')

	const s = spinner()
	s.start('Creating user...')

	try {
		const passwordHash = await passwords.generateHash(password)
		const user = await pris.user.create({
			data: {
				name,
				email,
				passwordHash,
				isSuperAdmin: true
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
