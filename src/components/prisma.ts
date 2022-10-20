import PrismaClientPkg from '@prisma/client';

// Prisma doesn't support ES Modules so we have to do this
const PrismaClient = PrismaClientPkg.PrismaClient;
export const prisma = new PrismaClient();

/* export function get_user(id: string) {
	const user = await prisma.user.findUnique({ where: { id: id } });
    user.
} */
