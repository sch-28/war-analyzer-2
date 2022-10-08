/* export class War {
	date: Date = new Date();
	is_nodewar: Boolean = false;
	name: string = '';
	guilds: Guild[] = [];
}

export class Guild {
	name: string = '';
	players: Player[] = [];

	add_player(name: string) {
		this.players.push(new Player(name, this));
	}
}

export class Player {
	name: string = '';
	guild: Guild;

	constructor(name: string, guild: Guild) {
		this.name = name;
		this.guild = guild;
	}
}


 */

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

	constructor(war: War, guild: Guild) {
		this.war = war;
		this.guild = guild;
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

	normalized_log(guild: string) {
		if (guild == this.guild) {
			return new Log(this.player_two, this.player_one, !this.kill, 'Guild', this.time);
		}
		return this;
	}

	get parsed_time() {
		return new Date(this.time);
	}
}
