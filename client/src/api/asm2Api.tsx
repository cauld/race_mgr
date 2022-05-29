import axios from 'axios';

const baseUrl = 'http://localhost:9000';

export const getTrackList = () => {
	const request = axios({
		method: 'get',
		url: baseUrl + '/api/list/tracks',
		withCredentials: false,
	});

	return request;
};

export const getVehicleList = () => {
	const request = axios({
		method: 'get',
		url: baseUrl + '/api/list/vehicles',
		withCredentials: false,
	});

	return request;
};
