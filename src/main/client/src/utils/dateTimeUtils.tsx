import {convertEpochTime} from './epochUtils';

export const convertEpochTimeToRaceResult = (epoch:number) => {
	const e = epoch / 1000;
	const minutes = Math.floor(e / 60);
	const seconds = e - (minutes * 60);

	const result = minutes + ':' + seconds.toFixed(3).padStart(6, '0');
	return result;
};
