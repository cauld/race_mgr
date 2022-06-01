export const convertEpoch = (value:any) => {
	if (!value) {
		return '';
	}

	const time = new Date(Number(value * 1000));
	if (isNaN(time.valueOf())) {
		return '';
	}

	return time.toLocaleString('en-US', {month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true});
};

export const convertEpochDate = (value:any) => {
	if (!value) {
		return '';
	}

	const time = new Date(Number(value * 1000));
	if (isNaN(time.valueOf())) {
		return '';
	}

	return time.toLocaleString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
};

export const convertEpochTime = (value:any) => {
	if (!value) {
		return '';
	}

	const time = new Date(Number(value * 1000));
	if (isNaN(time.valueOf())) {
		return '';
	}

	return time.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
};

export const convertEpochDuration = (value:any) => {
	if (!value) {
		return '';
	}

	const minutes = Math.floor(value / 60);
	const seconds = value - (minutes * 60);

	return minutes + ' minutes and ' + seconds.toFixed(3) + ' seconds.';
};
