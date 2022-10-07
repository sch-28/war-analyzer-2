import { browser } from '$app/environment';
import { Event, Guild, Local_Guild, Local_Guild_Player, Log, Player, War } from '$root/types/data';
import type { Writable } from 'svelte/store';

import { writable, get } from 'svelte/store';
import { find_or_push } from './utils';

const storage = (key: string, initValue: Manager): Writable<Manager> => {
	const store = writable(initValue);

	if (!browser) return store;

	const storedValueStr = localStorage.getItem(key);

	if (storedValueStr != null) store.set(Manager.from_json(JSON.parse(storedValueStr)));

	store.subscribe((val) => {
		if (val == null || val == undefined) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, val.get_json());
		}
	});

	window.addEventListener('storage', () => {
		const storedValueStr = localStorage.getItem(key);

		if (storedValueStr == null) return;

		const localValue = Manager.from_json(JSON.parse(storedValueStr));

		// might need to implemenet compare function
		if (localValue !== get(store)) store.set(localValue);
	});

	return store;
};

export default storage;

export class Manager {
	wars: War[];
	players: Player[];
	guilds: Guild[];

	constructor() {
		this.wars = [];
		this.players = [];
		this.guilds = [];
	}

	find_or_create_guild(name: string) {
		let guild = this.guilds.find((g) => g.name == name);

		if (!guild) {
			guild = new Guild(name);
			this.guilds.push(guild);
		}

		return guild;
	}

	find_or_create_player(name: string, guild: Guild) {
		let player = this.players.find((p) => p.name == name);

		if (!player) {
			player = new Player(name, guild);
			this.players.push(player);
			guild.players.push(player);
		}

		return player;
	}

	static from_json(json: { name: string; date: Date; is_nodewar: boolean; logs: Log[] }[]) {
		const manager = new Manager();

		for (let war of json) {
			manager.add_war(war.name, war.date, war.is_nodewar, war.logs);
		}

		return manager;
	}

	get_json() {
		const json_wars = [];

		for (let war of this.wars) {
			json_wars.push({
				name: war.name,
				date: war.date,
				is_nodewar: war.is_nodewar,
				logs: war.logs.map(
					(e) =>
						new Log(e.player_one.name, e.player_two.name, e.kill, e.player_two.guild.name, ""+e.time)
				)
			});
		}

		return JSON.stringify(json_wars);
	}

	add_war(name: string, date: Date, is_nodewar: boolean, logs: Log[]) {
		// const war = new War(name, date, logs);
		//

		const events: Event[] = [];
		const guilds = new Set<Guild>();
		const players = new Set<Player>();

		for (let log of logs) {
			const guild_one = this.find_or_create_guild('Guild');
			const guild_two = this.find_or_create_guild(log.guild);

			guilds.add(guild_one).add(guild_two);

			const player_one = this.find_or_create_player(log.player_one, guild_one);
			const player_two = this.find_or_create_player(log.player_two, guild_two);

			// players.push(player_one, player_two);
			players.add(player_one).add(player_two);

			const event = new Event(player_one, player_two, log.kill, log.parsed_time);

			player_one.events.push(event);
			player_two.events.push(event);

			events.push(event);
		}

		const war = new War(name, date, is_nodewar, events);
		this.wars.push(war);

		for (let guild of guilds) {
			// create local guild that only contains information of the current war
			const local_guild = new Local_Guild(war, guild);
			guild.locals.push(local_guild);
			war.guilds.push(local_guild);

			// get all joined players and add them to the local guild
			for (let player of players) {
				if (player.guild == guild) {
					// create new local player
					const local_player = new Local_Guild_Player(local_guild, player);

					war.players.push(local_player);

					local_guild.local_players.push(local_player);
					player.locals.push(local_player);

					// extract all events that happened to the local player
					for (let event of events) {
						if (event.player_one == player || event.player_two == player) {
							local_player.local_events.push(event);
						}
					}
				}
			}
		}
	}
}

export const manager = storage('manager', new Manager());
