import { HOST_ADDRESS, DISCORD_API_URL, ComSpec } from '$env/static/private';
import type { Cookies, Handle, RequestEvent, ResolveOptions } from '@sveltejs/kit';
import type { MaybePromise } from '@sveltejs/kit/types/private';
import { refresh_discord_token } from './api/refresh';
import { prisma } from './components/prisma';
import type { User } from './types/user';

async function set_session(
	request: {
		event: RequestEvent<Partial<Record<string, string>>>;
	},
	user: User
) {
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

	return {
		avatar: user.avatar,
		discriminator: user.discriminator,
		id: user.id,
		username: user.username,
		wars: prisma_user.wars.map((war) => {
			return {
				name: war.name,
				date: war.date,
				is_nodewar: war.is_nodewar,
				logs: war.logs,
				guild_name: war.guild_name
			};
		})
	};
}

export const handle: Handle = async (request) => {
	var startTime = performance.now();
	const cookies = request.event.cookies;

	const refresh_token = cookies.get('refresh_token');
	const access_token = cookies.get('access_token');

	let new_cookies = '';

	if (refresh_token && !access_token) {
		//const refresh_request =await fetch(`${HOST_ADDRESS}/discord/refresh?code=${refresh_token}`);
		const refresh_request = await refresh_discord_token(refresh_token);
		if ('error' in refresh_request) {
			console.error(refresh_request, refresh_request.error);
			const response = await request.resolve(request.event);
			return response;
		}

		const discord_response = await refresh_request.json();

		if (discord_response.access_token) {
			const discord_request = await fetch(`${DISCORD_API_URL}/users/@me`, {
				headers: { Authorization: `Bearer ${discord_response.access_token}` }
			});
			new_cookies = refresh_request.headers.get('Set-Cookie') ?? '';

			// returns a discord user if JWT was valid
			const response = await discord_request.json();

			if (response.id) {
				request.event.locals.user = await set_session(request, response);
			}
		}
	} else if (access_token) {
		const discord_request = await fetch(`${DISCORD_API_URL}/users/@me`, {
			headers: { Authorization: `Bearer ${access_token}` }
		});

		const response = await discord_request.json();
		if (response.id) {
			request.event.locals.user = await set_session(request, response);
		}
	}

	const response = await request.resolve(request.event);
	if (new_cookies.length > 0) {
		response.headers.set('Set-Cookie', new_cookies);
		response.headers.set('etag', '');
	}
	var endTime = performance.now();

	console.log(`Call to authenticate user took ${endTime - startTime} milliseconds`);
	return response;
};
