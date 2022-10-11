export function find_or_push<T>(array: Array<T>, object: T) {
	let result = array.find((a) => a == object);

	if (!result) {
		array.push(object);
	}

	return object;
}

export function format(number: number, places:number = 2) {
	return number.toFixed(places);
}


export function tag_compare(a: { props: { content: string } }, b: { props: { content: string } }) {
	const number_a = +a.props.content.split('>')[1].split('<')[0].replace("%","");
	const number_b = +b.props.content.split('>')[1].split('<')[0].replace("%","");

	if (number_a > number_b) {
		return 1;
	} else if (number_b > number_a) {
		return -1;
	} else {
		return 0;
	}
}