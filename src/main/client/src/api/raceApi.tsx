import axios from 'axios';

const baseUrl = 'http://localhost:8080';

export const apiRaceData = () => {
	const request = axios({
		method: 'get',
		url: baseUrl + '/api/v1/race/events?raceSessionId=&raceRotationId=&page=0&limit=200',
		withCredentials: false,
	});

	return request;
};
