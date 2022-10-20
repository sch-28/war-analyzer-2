import { HOST, DISCORD_API_URL } from '$env/static/private';
import type { Cookies, Handle } from '@sveltejs/kit';
import { prisma } from './components/prisma';
import type { User } from './types/user';

async function set_session(locals: App.Locals, user: User) {
	const prisma_user = await prisma.user.upsert({
		where: { id: user.id },
		update: {},
		create: { id: user.id, discriminator: user.discriminator, username: user.username },
		include: {
			wars: {
				include: {
					logs: true
				}
			}
		}
	});

	locals.user = {
		avatar: user.avatar,
		discriminator: user.discriminator,
		id: user.id,
		username: user.username,
		wars: prisma_user.wars.map((war) => {
			return { name: war.name, date: war.date, is_nodewar: war.is_nodewar, logs: war.logs };
		})
	};
}

export const handle: Handle = async (request) => {
	const cookies = request.event.cookies;

	const refresh_token = cookies.get('refresh_token');
	const access_token = cookies.get('access_token');

	let new_cookies = '';

	if (refresh_token && !access_token) {
		const refresh_request = await fetch(`${HOST}/discord/refresh?code=${refresh_token}`);

		const discord_response = await refresh_request.json();

		if (discord_response.access_token) {
			const discord_request = await fetch(`${DISCORD_API_URL}/users/@me`, {
				headers: { Authorization: `Bearer ${discord_response.access_token}` }
			});
			new_cookies = refresh_request.headers.get('Set-Cookie') ?? '';

			// returns a discord user if JWT was valid
			const response = await discord_request.json();

			if (response.id) {
				set_session(request.event.locals, response);
			}
		}
	} else if (access_token) {
		const discord_request = await fetch(`${DISCORD_API_URL}/users/@me`, {
			headers: { Authorization: `Bearer ${access_token}` }
		});

		const response = await discord_request.json();
		if (response.id) {
			set_session(request.event.locals, response);
		}
	}

	const response = await request.resolve(request.event);
	if (new_cookies.length > 0) {
		response.headers.set('Set-Cookie', new_cookies);
		response.headers.set('etag', '');
	}
	return response;
};
