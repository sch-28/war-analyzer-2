import { prisma } from '$root/components/prisma';
import type { Manager_JSON } from '$root/components/store';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	const user = event.locals.user;
	const war = (await event.request.json()) as Manager_JSON;
	if (!war || !war.date || war.is_nodewar == undefined || !war.logs || !war.name) {
		return new Response('Invalid body', { status: 500 });
	}
	if (!user) {
		return new Response('Not logged in', { status: 500 });
	}
	try {
		const prisma_war = await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				wars: {
					create: {
						date: war.date,
						is_nodewar: war.is_nodewar,
						name: war.name,
						logs: {
							create: war.logs
						}
					}
				}
			}
		});

		return new Response(null, { status: 200 });
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify(e), { status: 500 });
	}
};
