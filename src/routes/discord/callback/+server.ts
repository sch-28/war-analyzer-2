import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT_URI
} from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	// fetch returnCode set in the URL parameters.
	const returnCode = event.url.searchParams.get('code');
	if (!returnCode) {
		console.error('No return code found.');
		return new Response(null, { headers: { Location: '/' }, status: 302 });
	}
	console.log('returnCode =>', returnCode);

	// initializing data object to be pushed to Discord's token endpoint.
	// the endpoint returns access & refresh tokens for the user.
	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'authorization_code',
		redirect_uri: DISCORD_REDIRECT_URI,
		code: returnCode,
		scope: 'identify'
	};

	// performing a Fetch request to Discord's token endpoint
	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	const response = await request.json();

	// redirect to front page in case of error
	if (response.error) {
		console.log('redirect to / due error, return code: ', returnCode);
		return new Response(null, { headers: { Location: '/' }, status: 302 });
	}

	// redirect user to front page with cookies set
	const access_token_expires_in = new Date(Date.now() + response.expires_in); // 10 minutes
	const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
	console.log('redirect to / with cookies');

	//return new Response(null, { status: 302, headers: { Location: DISCORD_ENDPOINT } });
	return new Response(null, {
		headers: {
			'set-cookie': `access_token=${response.access_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${access_token_expires_in}},
				refresh_token=${response.refresh_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${refresh_token_expires_in}`,
			Location: '/'
		},
		status: 302
	});
};
