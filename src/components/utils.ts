export function find_or_push<T>(array: Array<T>, object: T) {
	let result = array.find((a) => a == object);

	if (!result) {
		array.push(object);
	}

	return object;
}

export function format(number: number) {
	return number.toFixed(2);
}
