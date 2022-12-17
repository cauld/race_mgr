import _ from 'lodash';

import {ISession, IServerConfig, IAddRotation, IRotationDetail} from './interfaces';

import {defaultConfig} from './defaults';

import RaceMgrApi from '../../api/RaceMgrApi';

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

export const addSession = async (sessionName:string) => {
	const rmApi = new RaceMgrApi();

	try {
		const requestConfig = {
			url: `${rmApi.getBaseApiUrl()}/admin/race/session`,
			data: {
				name: sessionName,
			},
			method: 'POST',
		};

		const apiResults = await rmApi.makeApiCall(requestConfig);
		const {data: apiData} = apiResults;
		return apiData.data?.id;
	} catch (err) {
		console.log('Error', err);
	}
};

export const addRotation = async (rotation:IAddRotation) => {
	const rmApi = new RaceMgrApi();

	let data = {};

	if (rotation.rotationName.length > 0) {
		data = {
			name: rotation.rotationName,
			raceCount: rotation.raceSize,
			allowKarts: rotation.allowKarts,
			persist: rotation.persist,
			restart: rotation.restart,
		};
	} else {
		data = {
			raceCount: rotation.raceSize,
			allowKarts: rotation.allowKarts,
			persist: rotation.persist,
			restart: rotation.restart,
		};
	}

	try {
		const requestConfig = {
			url: `${rmApi.getBaseApiUrl()}/admin/race/rotation`,
			data,
			method: 'POST',
		};

		const apiResults = await rmApi.makeApiCall(requestConfig);
		const {data: apiData} = apiResults;
		return apiData.data?.id;
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

export const fetchRotationDetail = async (rotationId:string) => {
	const rmApi = new RaceMgrApi();
	try {
		const requestConfig = {
			url: `${rmApi.getBaseApiUrl()}/race/rotation/` + rotationId,
			method: 'get',
		};

		const apiResults = await rmApi.makeApiCall(requestConfig);
		const {data: apiData} = apiResults;
		const rotationDetailData = apiData.data || null;

		let results;
		if (rotationDetailData === null) {
			results = {};
		} else {
			const rotationDetail = mapRotationDetailToRotationDetailObject(rotationDetailData);
			results = rotationDetail;
		}

		return results;
	} catch (err) {
		console.log('Error', err);
	}
};

export const updateServerConfig = async (config:IServerConfig) => {
	const rmApi = new RaceMgrApi();

	try {
		const requestConfig = {
			url: `${rmApi.getBaseApiUrl()}/admin/config`,
			data: config,
			method: 'put',
		};

		return await rmApi.makeApiCall(requestConfig);
	} catch (err) {
		console.log('Error', err);
	}
};

export const updateServer = async (action: string) => {
	const rmApi = new RaceMgrApi();

	try {
		const requestConfig = {
			url: `${rmApi.getBaseApiUrl()}/admin/gameserver`,
			data: {status: action},
			method: 'post',
		};

		return await rmApi.makeApiCall(requestConfig);
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
				activeRaceRotationId: serverConfig.activeRaceRotationId,
				serverName: serverConfig.serverName,
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

const mapRotationDetailToRotationDetailObject = (data:any):IRotationDetail => {
	const rotataionDetails:IRotationDetail = {
		id: data.id,
		name: data.name,
		vehicleClassId: data.config.defaultConfig.VehicleClassId,
		rotations: [],
	};

	rotataionDetails.rotations = data.config.rotation.map(r => ({
		name: r.TrackId,
	}));

	return rotataionDetails;
};

