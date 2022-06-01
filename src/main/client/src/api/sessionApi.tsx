import axios from 'axios';

const baseUrl = 'http://localhost:8080';

export const getSessionData = () => {
	const request = axios({
		method: 'get',
		url: baseUrl + '/api/v1/race/session?page=0&limit=100',
		withCredentials: false,
	});

	return request;
};
