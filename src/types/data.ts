export class Guild {
	locals: Local_Guild[] = [];
	name: string;
	players: Player[] = [];

	constructor(name: string) {
		this.name = name;
	}
}

export class War {
	id: number;
	local_guilds: Local_Guild[] = [];
	local_players: Local_Guild_Player[] = [];
	date: Date;
	name: string;
	logs: Event[];
	is_nodewar: boolean;

	constructor(id: number, name: string, date: Date, is_nodewar: boolean, logs: Event[]) {
		this.date = date;
		this.name = name;
		this.logs = logs;
		this.is_nodewar = is_nodewar;
		this.id = id;
	}

	get formatted_date() {
		return this.date.toLocaleDateString();
	}

	get enemy_local_guilds() {
		return this.local_guilds.filter((g) => g.guild.name != 'Guild');
	}

	get kills() {
		return this.logs.filter((l) => l.kill);
	}

	get deaths() {
		return this.logs.filter((l) => !l.kill);
	}

	get sorted_guilds() {
		const guilds = [...this.local_guilds].sort((a, b) => b.kills - b.deaths - (a.kills - a.deaths));
		return guilds;
	}
}

export class Player {
	locals: Local_Guild_Player[] = [];
	name: string;
	guild: Guild;
	events: Event[] = [];

	constructor(name: string, guild: Guild) {
		this.guild = guild;
		this.name = name;
	}
}

export class Local_Guild {
	guild: Guild;
	war: War;
	local_players: Local_Guild_Player[] = [];
	local_events: Event[] = [];

	constructor(war: War, guild: Guild) {
		this.war = war;
		this.guild = guild;
	}

	get kill_events() {
		return this.local_events.filter((l) => l.normalized_kill(this.guild));
	}

	get death_events() {
		return this.local_events.filter((l) => !l.normalized_kill(this.guild));
	}

	get kills() {
		return this.kill_events.length;
	}

	get deaths() {
		return this.death_events.length;
	}

	get kd() {
		if (this.deaths == 0) {
			return this.kills;
		}

		return this.kills / this.deaths;
	}

	get average_kills() {
		if (this.local_players.length == 0) return 0;
		return this.kills / this.local_players.length;
	}

	get sorted_players() {
		return [...this.local_players].sort((a, b) => b.kills - a.kills);
	}
}

export class Local_Guild_Player {
	player: Player;
	local_guild: Local_Guild;
	local_events: Event[] = [];

	constructor(local_guild: Local_Guild, player: Player) {
		this.local_guild = local_guild;
		this.player = player;
	}

	get kill_events() {
		return this.local_events.filter((l) => l.normalized_kill(this.player.guild));
	}

	get death_events() {
		return this.local_events.filter((l) => !l.normalized_kill(this.player.guild));
	}

	get kills() {
		return this.kill_events.length;
	}

	get deaths() {
		return this.death_events.length;
	}

	get kd() {
		if (this.deaths == 0) {
			return this.kills;
		}

		return this.kills / this.deaths;
	}

	get performance() {
		if (this.local_guild.average_kills == 0) return this.kills;
		return this.kills / this.local_guild.average_kills;
	}
}
export class Event {
	player_one: Player;
	player_two: Player;
	kill: boolean;
	time: Date;

	constructor(p1: Player, p2: Player, kill: boolean, time: Date) {
		this.player_one = p1;
		this.player_two = p2;
		this.kill = kill;
		this.time = time;
	}

	normalized_kill(guild: Guild) {
		if (guild == this.player_one.guild) {
			return this.kill;
		}
		return !this.kill;
	}
}

export class Log {
	player_one: string;
	player_two: string;
	kill: boolean;
	guild: string;
	time: string;

	constructor(p1: string, p2: string, kill: boolean, guild: string, time: string) {
		this.player_one = p1;
		this.player_two = p2;
		this.kill = kill;
		this.guild = guild;
		if (this.guild == '-1') {
			this.guild = 'No Guild';
		}
		this.time = time;
	}

	static parse_log(log: string) {
		const regex = /\[(.*)\] (\w*) (died to|has killed) (\w*) from (\w*)/;
		const results = log.match(regex);
		if (results && results.length == 6) {
			const kill = results[3] == 'has killed';
			return new Log(results[2], results[4], kill, results[5], results[1]);
		}

		throw new Error(`Invalid Log: ${log}`);
	}

	get parsed_time() {
		return new Date(this.time);
	}
}
