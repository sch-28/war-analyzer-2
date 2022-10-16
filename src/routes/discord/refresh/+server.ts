import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT_URI
} from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const refresh_token = event.url.searchParams.get('code');

	if (!refresh_token) {
		return new Response(JSON.stringify({ error: 'No refresh token found' }), {
			status: 500
		});
	}

	// initializing data object to be pushed to Discord's token endpoint.
	// quite similar to what we set up in callback.js, expect with different grant_type.
	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'refresh_token',
		redirect_uri: DISCORD_REDIRECT_URI,
		refresh_token: refresh_token,
		scope: 'identify'
	};

	// performing a Fetch request to Discord's token endpoint
	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	const response = await request.json();

	if (response.error) {
		return new Response(JSON.stringify({ error: response.error }), {
			status: 500
		});
	}

	// redirect user to front page with cookies set
	const access_token_expires_in = new Date(Date.now() + response.expires_in); // 10 minutes
	const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
	console.log('set refreshed cookies');
	return new Response(JSON.stringify({ access_token: response.access_token }), {
		headers: {
			'set-cookie': `access_token=${response.access_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${access_token_expires_in}}
				refresh_token=${response.refresh_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${refresh_token_expires_in}`
		},
		status: 200
	});
};
