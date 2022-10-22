import type { War_JSON } from '$root/components/store';

export interface User {
	username: string;
	discriminator: string;
	avatar: string;
	id: string;
	wars: War_JSON[];
}
