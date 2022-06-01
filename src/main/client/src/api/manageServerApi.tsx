import axios from 'axios';

const baseUrl = 'http://192.168.1.85:8080';

export const apiGetServerStatus = () => {
	const request = axios({
		method: 'get',
		url: baseUrl + '/api/v1/gameserver',
		withCredentials: false,
	});

	return request;
};

export const apiManageServer = (status:string) => axios.post(baseUrl + '/api/v1/gameserver', {status});

export const apiSetNewRotation = () => {
	const request = axios.post(baseUrl + '/api/v1/rotation', {
		raceCount: '10',
		allowKarts: 'false',
		persist: 'true',
		restart: 'true'});

	return request;
};

export const apiGetRotation = () => {
	const request = axios({
		method: 'get',
		url: baseUrl + '/api/v1/rotation',
		withCredentials: false,
	});

	return request;
};
