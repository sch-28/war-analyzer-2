import type { Manager_JSON } from '$root/components/store';

export interface User {
	username: string;
	discriminator: string;
	avatar: string;
	id: string;
	wars: Manager_JSON[];
}
