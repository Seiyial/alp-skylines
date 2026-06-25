import { passwords } from '@/lib/auth/passwords'
import { pris } from '@/lib/db/prisma'
import {
	intro, isCancel, outro, select, spinner, text
} from '@clack/prompts'

async function main () {
	intro('Reset a user password')

	const users = await pris.user.findMany({
		orderBy: { createdAt: 'asc' }
	})

	if (users.length === 0) {
		return outro('No users found.')
	}

	const user = await select({
		message: 'Choose the user whose password to reset:',
		options: users.map((u) => ({
			value: u,
			label: (u.email ?? '(no email)') + ' ' + `(${u.id})`,
			hint: u.name
		}))
	})
	if (isCancel(user)) return outro('Operation cancelled.')

	const password = await text({ message: 'Enter the new password:' })
	if (isCancel(password)) return outro('Operation cancelled.')

	const s = spinner()
	s.start('Resetting password...')

	try {
		const passwordHash = await passwords.generateHash(password)
		const updated = await pris.user.update({
			where: { id: user.id },
			data: {
				passwordHash,
				shouldChangePassword: true
			}
		})

		s.stop('Password reset successfully!')
		console.log('User:', updated)
	} catch (error) {
		s.stop('Failed to reset password.')
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