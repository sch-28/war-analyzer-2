import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = (event) => {
	console.log(event.locals);
	return event.locals.user;
};
