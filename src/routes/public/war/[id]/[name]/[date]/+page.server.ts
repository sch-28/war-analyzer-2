import { prisma } from '$root/components/prisma';
import type { Prisma } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!params.id) throw error(500, 'Missing ID');
	if (!params.name) throw error(500, 'Missing name');
	if (!params.date) throw error(500, 'Missing date');

	const war = await prisma.war.findUnique({
		where: {
			date_name_userId: { name: params.name, date: params.date, userId: params.id }
		},
		include: {
			logs: true
		}
	});

	if (war) {
		return war;
	}

	throw error(404, 'Not found');
};
