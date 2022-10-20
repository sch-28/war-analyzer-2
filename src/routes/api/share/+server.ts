import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
    const user = event.locals.user;
    

	return new Response(null, { status: 302 });
};
