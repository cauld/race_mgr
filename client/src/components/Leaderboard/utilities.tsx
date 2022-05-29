import _ from 'lodash';

import api from '../../api/baseApi';
import {getTrackList, getVehicleList} from '../../api/asm2Api';

import {ITrackData, IVehicleData} from '../../interfaces/asm2Interfaces';

import {calculatePoints} from '../../utils/pointsCalculator';

import {ISession, IRace} from './interfaces';

export const fetchSessions = async () => {
	try {
		const results = await api.get('/race/session?page=0&limit=1000')
			.then(sessions => mapSessionDataToSessionObject(sessions.data.data.content));

		const sortedResults = _.orderBy(results, ['startDate'], 'desc');
		return sortedResults;
	} catch (err) {
		console.log('Error', err);
	}
};

export const fetchServerConfig = async () => {
	try {
		const results = await api.get('/config').then((config:any) => (
			{
				activeRaceSessionId: config.data.data.activeRaceSessionId,
			}
		));
		return results;
	} catch (err) {
		console.log('Error', err);
	}
};

export const fetchRaceData = async (currentSessionId:string) => {
	try {
		if (!currentSessionId) {
			return [];
		}

		const sessionId = currentSessionId === 'All' ? '' : currentSessionId;
		const results = await api.get('/race/events?raceSessionId=' + sessionId + '&raceRotationId=&page=0&limit=10000')
			.then(races =>
				mapRaceDataToRaceResultsObject(races.data.data.content),
			);
		return results;
	} catch (err) {
		console.log('Error', err);
	}
};

export const fetchTrackData = async () => {
	try {
		const trackData:Array<ITrackData> = [];

		const response = await getTrackList();
		for (const track in response.data.response.list) {
			const thisTrack = response.data.response.list[track];
			trackData.push({gridsize: thisTrack.gridsize, id: thisTrack.id, name: thisTrack.name});
		}

		return response.data.response.list;
	} catch (err) {
		console.log('Error', err);
	}
};

export const fetchVehicleData = async () => {
	try {
		const vehicleData:Array<IVehicleData> = [];

		const response = await getVehicleList();
		for (const vehicle in response.data.response.list) {
			const thisVehicle = response.data.response.list[vehicle];
			vehicleData.push({id: thisVehicle.id, name: thisVehicle.name, class: thisVehicle.class});
		}

		return response.data.response.list;
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

const mapRaceDataToRaceResultsObject = (data:Array<any>):Array<IRace> => {
	const raceResults:Array<IRace> = [];

	const finishedRaces = data.filter(d => d.finished === true && d.stages.race1);

	for (const d in finishedRaces) {
		const thisRace = finishedRaces[d];
		const fastestLapTimes = thisRace.stages.race1?.results.map(result => ({
			driverName: result.name,
			fastestLapTime: result.attributes.FastestLapTime,
		}));

		const polePositionName = _.head(thisRace.stages.qualifying1?.results).name;
		const winnerName = _.head(thisRace.stages.race1?.results).name;
		const fastestLapName = _.head(_.orderBy(fastestLapTimes?.filter(fl => fl.fastestLapTime > 0), ['fastestLapTime'], ['asc']))?.driverName;

		const participantList:Array<string> = [];
		for (const p in thisRace.participants) {
			const thisP = thisRace.participants[p];
			participantList.push(thisP.Name);
		}

		const raceResult:IRace = {
			trackName: thisRace.setup.TrackId,
			startDate: thisRace.start_time,
			endDate: thisRace.end_time,
			finished: thisRace.finished,
			gridSize: Object.keys(thisRace.participants).length,
			laps: thisRace.setup.RaceLength,
			aiStrength: thisRace.setup.OpponentDifficulty,
			participants: participantList,
			raceResults: thisRace.stages.race1?.results?.map((r:any) => ({
				driverName: r.name,
				isPlayer: r.is_player,
				finishPosition: r.attributes.RacePosition,
				vehicleId: r.attributes.VehicleId,
				fastestLapTime: r.attributes.FastestLapTime,
				totalTime: r.attributes.TotalTime,
				totalPoints: calculatePoints(r.attributes.RacePosition, Object.keys(thisRace.participants).length, r.name === polePositionName, r.name === fastestLapName),
				hadFastestLap: r.name === fastestLapName,
			})),
			qualifyingResults: thisRace.stages.qualifying1?.results.map((r:any) => ({
				driverName: r.name,
				bestQualifyingTime: r.attributes.FastestLapTime,
				tookPole: r.name === polePositionName,
			})),
			polePosition: polePositionName,
			fastestLap: fastestLapName,
			winner: winnerName,

		};
		raceResults.push(raceResult);
	}

	return raceResults;
};
