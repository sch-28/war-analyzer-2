import { HOST, DISCORD_API_URL } from '$env/static/private';
import type { Cookies, Handle } from '@sveltejs/kit';
import { resolve } from 'dns';

async function get_discord_user(cookies: Cookies) {
	const refresh_token = cookies.get('refresh_token');
	const access_token = cookies.get('access_token');

	if (refresh_token && !access_token) {
		const discord_request = await fetch(`${HOST}/discord/refresh?code=${refresh_token}`);
		const discord_response = await discord_request.json();

		if (discord_response.access_token) {
			console.log('setting discord user via refresh token..');
			const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
				headers: { Authorization: `Bearer ${discord_response.access_token}` }
			});

			// returns a discord user if JWT was valid
			const response = await request.json();

			if (response.id) {
				return {
					// only include properties needed client-side —
					// exclude anything else attached to the user
					// like access tokens etc
					...response
				};
			}
		}
	} else if (access_token) {
		console.log('setting discord user via access token..');
		const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
			headers: { Authorization: `Bearer ${access_token}` }
		});

		// returns a discord user if JWT was valid
		const response = await request.json();

		if (response.id) {
			return {
				// only include properties needed client-side —
				// exclude anything else attached to the user
				// like access tokens etc
				...response
			};
		}
	}
}

export const handle: Handle = async (request) => {
	request.event.locals.user = await get_discord_user(request.event.cookies);

	const response = await request.resolve(request.event);
	response.headers.set('x-custom-header', 'potato');

	return response;
};
