export const sanitizeString = (value:string) => {
	const reg = /[^a-zA-Z\d\s]+/g; // Replace all non-alphanumeric, leave spaces

	return value.replace(reg, '');
};
