// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { User } from './types/user';
declare global {
	declare namespace App {
		interface Locals {
			user: User | undefined;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}
