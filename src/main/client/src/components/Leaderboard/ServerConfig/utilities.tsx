import _ from 'lodash';

import {ISession} from './interfaces';

import {defaultConfig} from './defaults';

import RaceMgrApi from '../../../api/RaceMgrApi';

export const fetchSessions = async () => {
	const rmApi = new RaceMgrApi();

	try {
		const requestConfig = {
			url: `${rmApi.getBaseApiUrl()}/race/session?page=0&limit=1000`,
			method: 'get',
		};

		const apiResults = await rmApi.makeApiCall(requestConfig);
		const {data: apiData} = apiResults;
		const sessionContent = apiData.data.content || null;

		let sortedResults;
		if (sessionContent === null) {
			sortedResults = [];
		} else {
			const sessions = mapSessionDataToSessionObject(sessionContent);
			sortedResults = _.orderBy(sessions, ['startDate'], 'desc');
		}

		return sortedResults;
	} catch (err) {
		console.log('Error', err);
	}
};

export const fetchRotations = async () => {
	const rmApi = new RaceMgrApi();
	try {
		const requestConfig = {
			url: `${rmApi.getBaseApiUrl()}/race/rotation?page=0&limit=1000`,
			method: 'get',
		};

		const apiResults = await rmApi.makeApiCall(requestConfig);
		const {data: apiData} = apiResults;
		const rotationContent = apiData.data.content || null;

		let sortedResults;
		if (rotationContent === null) {
			sortedResults = [];
		} else {
			const rotations = mapSessionDataToSessionObject(rotationContent);
			sortedResults = _.orderBy(rotations, ['id'], 'desc');
		}

		return sortedResults;
	} catch (err) {
		console.log('Error', err);
	}
};

export const fetchServerConfig = async () => {
	const rmApi = new RaceMgrApi();
	try {
		const requestConfig = {
			url: `${rmApi.getBaseApiUrl()}/config`,
			method: 'get',
		};

		const apiResults = await rmApi.makeApiCall(requestConfig);
		const {data: apiData} = apiResults;
		const serverConfig = apiData.data || null;

		let configResults;

		if (serverConfig === null) {
			configResults = defaultConfig;
		} else {
			configResults = {
				activeRaceSessionId: serverConfig.activeRaceSessionId,
				activeRaceRotationId: serverConfig.activeRaceRotationId
			};
		}

		return configResults;
	} catch (err) {
		console.log('Error', err);
	}
};

const mapSessionDataToSessionObject = (data:Array<any>):Array<ISession> => {
	const mappedResult:Array<ISession> = data.map(d => ({
		id: d.id,
		name: d.name,
		startDate: d.created,
		finished: true,
	}));

	return mappedResult;
};

