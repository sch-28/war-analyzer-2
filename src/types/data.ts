import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export class Guild {
	locals: Local_Guild[] = [];
	name: string;
	players: Player[] = [];

	average_kill_difference: number = 0;
	kills: number = 0;
	deaths: number = 0;

	average_kills: number = 0;
	average_deaths: number = 0;

	constructor(name: string) {
		this.name = name;
		this.update();
	}

	update() {
		this.kills = this.get_kills();
		this.deaths = this.get_deaths();
		this.average_kills = this.get_average_kills();
		this.average_deaths = this.get_average_deaths();

		this.average_kill_difference = this.get_average_kill_difference();
	}

	get_kills() {
		return this.locals.reduce((sum, g) => sum + g.kills, 0);
	}

	get_deaths() {
		return this.locals.reduce((sum, g) => sum + g.kills, 0);
	}

	get_average_kill_difference() {
		return this.locals.reduce((sum, g) => sum + g.kill_difference, 0);
	}

	get_average_kills() {
		if (this.locals.length == 0) return 0;
		return this.locals.reduce((sum, g) => sum + g.average_kills, 0) / this.locals.length;
	}

	get_average_deaths() {
		if (this.locals.length == 0) return 0;
		return this.locals.reduce((sum, g) => sum + g.average_deaths, 0) / this.locals.length;
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
		this.update();
	}

	update() {
		this.local_players.forEach((p) => p.update());
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

	kills: number = 0;
	deaths: number = 0;

	average_kills: number = 0;
	average_deaths: number = 0;

	average_performance: number = 0;

	average_duration_percentage: number = 0;
	participation_percentage: number = 0;

	kill_events: Event[] = [];
	death_events: Event[] = [];

	constructor(name: string, guild: Guild) {
		this.guild = guild;
		this.name = name;
		this.update();
	}

	update() {
		this.kills = this.get_total_kills();
		this.deaths = this.get_total_deaths();

		this.average_kills = this.get_average_kills();
		this.average_deaths = this.get_average_deaths();

		this.average_performance = this.get_average_performance();

		this.average_duration_percentage = this.get_average_duration_percentage();
		this.participation_percentage = this.get_participation_percentage();
	}

	get_total_kills() {
		return this.locals.reduce((sum, local) => sum + local.kills, 0);
	}
	get_total_deaths() {
		return this.locals.reduce((sum, local) => sum + local.deaths, 0);
	}

	get_average_kills() {
		if (this.locals.length == 0) return 0;
		return this.get_total_kills() / this.locals.length;
	}
	get_average_deaths() {
		if (this.locals.length == 0) return 0;
		return this.get_total_deaths() / this.locals.length;
	}

	get_average_performance() {
		if (this.locals.length == 0) return 0;
		const total = this.locals.reduce((sum, local) => sum + local.performance, 0);

		return total / this.locals.length;
	}

	get_average_duration_percentage() {
		if (this.locals.length == 0) return 0;
		const total = this.locals.reduce((sum, local) => sum + local.duration_percentage, 0);

		return total / this.locals.length;
	}

	get_participation() {
		return this.locals.length;
	}

	get_participation_percentage() {
		if (this.guild.locals.length == 0) return 0;

		return this.get_participation() / this.guild.locals.length;
	}
}

export class Local_Guild {
	guild: Guild;
	war: War;
	local_players: Local_Guild_Player[] = [];
	sorted_local_players: Local_Guild_Player[] = [];
	local_events: Event[] = [];

	kills: number = 0;
	deaths: number = 0;

	kill_difference: number = 0;

	average_kills: number = 0;
	average_deaths: number = 0;
	kd: number = 0;

	duration: number = 0;

	kill_events: Event[] = [];
	death_events: Event[] = [];

	constructor(war: War, guild: Guild) {
		this.war = war;
		this.guild = guild;
		this.update();
	}

	update() {
		this.kill_events = this.get_kill_events();
		this.death_events = this.get_death_events();

		this.kills = this.kill_events.length;
		this.deaths = this.death_events.length;

		this.kill_difference = this.kills - this.deaths;

		this.average_kills = this.get_average_kills();
		this.average_deaths = this.get_average_deaths();
		this.kd = this.get_kd();

		this.duration = this.get_duration();

		this.sorted_local_players = this.get_sorted_players();
		this.guild.update();
	}

	get_kill_events() {
		return this.local_events.filter((l) => l.normalized_kill(this.guild));
	}

	get_death_events() {
		return this.local_events.filter((l) => !l.normalized_kill(this.guild));
	}

	get_kd() {
		if (this.deaths == 0) {
			return this.kills;
		}

		return this.kills / this.deaths;
	}

	get_average_kills() {
		if (this.local_players.length == 0) return 0;
		return this.kills / this.local_players.length;
	}

	get_average_deaths() {
		if (this.local_players.length == 0) return 0;
		return this.deaths / this.local_players.length;
	}

	get_sorted_players() {
		return [...this.local_players].sort((a, b) => b.kills - a.kills);
	}

	get_duration() {
		const logs = [...this.get_kill_events(), ...this.get_death_events()];
		if (logs.length < 2) return 0;

		logs.sort((a, b) => (b.time <= a.time ? 1 : -1));

		const start = logs[0].time;
		const end = logs[logs.length - 1].time;
		return end.diff(start, 'minutes');
	}
}

export class Local_Guild_Player {
	player: Player;
	local_guild: Local_Guild;
	local_events: Event[] = [];

	kills: number = 0;
	deaths: number = 0;

	kd: number = 0;
	performance: number = 0;

	duration: number = 0;
	duration_percentage: number = 0;

	kill_events: Event[] = [];
	death_events: Event[] = [];

	constructor(local_guild: Local_Guild, player: Player) {
		this.local_guild = local_guild;
		this.player = player;
		this.update();
	}

	update() {
		this.kill_events = this.get_kill_events();
		this.death_events = this.get_death_events();

		this.kills = this.kill_events.length;
		this.deaths = this.death_events.length;

		this.kd = this.get_kd();
		this.performance = this.get_performance();

		this.duration = this.get_join_duration();
		this.duration_percentage = this.get_join_duration_percentage();

		this.local_guild.update();
		this.player.update();
	}

	get_kill_events() {
		return this.local_events.filter((l) => l.normalized_kill(this.player.guild));
	}

	get_death_events() {
		return this.local_events.filter((l) => !l.normalized_kill(this.player.guild));
	}

	get_kd() {
		if (this.deaths == 0) {
			return this.kills;
		}

		return this.kills / this.deaths;
	}

	get_performance() {
		if (this.local_guild.average_kills == 0) return this.kills;
		return this.kills / this.local_guild.average_kills;
	}

	get_join_duration() {
		const logs = [...this.kill_events, ...this.death_events];
		if (logs.length < 2) return 0;

		logs.sort((a, b) => (b.time <= a.time ? 1 : -1));

		const start = logs[0].time;
		const end = logs[logs.length - 1].time;
		return end.diff(start, 'minutes');
	}

	get_join_duration_percentage() {
		if (this.get_join_duration() == 0) return 0;

		return this.get_join_duration() / this.local_guild.get_duration();
	}
}
export class Event {
	player_one: Player;
	player_two: Player;
	kill: boolean;
	time: Dayjs;

	constructor(p1: Player, p2: Player, kill: boolean, time: Dayjs) {
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

	get time_string() {
		return this.time.format('HH:mm:ss');
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
		return dayjs(this.time, 'HH:mm:ss');
	}
}
