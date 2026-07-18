import { env } from '@/env'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { PrismaClient } from '../../generated/prisma'

const adapter = new PrismaPg({
	connectionString: env.DATABASE_URL
})
export const pris = new PrismaClient({
	adapter
})
