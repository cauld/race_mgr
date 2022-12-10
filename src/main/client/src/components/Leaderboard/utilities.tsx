import _ from 'lodash';

import {calculatePoints} from '../../utils/pointsCalculator';
import {IRace} from './interfaces';

import RaceMgrApi from '../../api/RaceMgrApi';

export const fetchRaceData = async (currentSessionId:string, currentRotationId: string) => {
	const rmApi = new RaceMgrApi();
	try {
		if (!currentSessionId) {
			return [];
		}

		const sessionId = currentSessionId === 'All' ? '' : currentSessionId;
		const rotationId = currentRotationId === 'All' ? '' : currentRotationId;

		const requestConfig = {
			url: `${rmApi.getBaseApiUrl()}/race/events?raceSessionId=${sessionId}&raceRotationId=${rotationId}&page=0&limit=10000`,
			method: 'get',
		};

		const apiResults = await rmApi.makeApiCall(requestConfig);
		const {data: apiData} = apiResults;
		const raceData = apiData.data.content || null;

		let sessionResults;
		if (raceData === null) {
			sessionResults = [];
		} else {
			sessionResults = mapRaceDataToRaceResultsObject(raceData);
		}

		return sessionResults;
	} catch (err) {
		console.log('Error', err);
	}
};

export const fetchTrackData = async () => {
	const rmApi = new RaceMgrApi();
	try {
		const requestConfig = {
			url: `${rmApi.getBaseApiUrl()}/gameserver/tracks`,
			method: 'get',
		};

		const apiResults = await rmApi.makeApiCall(requestConfig);
		const {data: apiData} = apiResults;
		const trackData = apiData.data || null;
		return trackData;
	} catch (err) {
		console.log('Error', err);
	}
};

export const fetchVehicleData = async () => {
	const rmApi = new RaceMgrApi();
	try {
		const requestConfig = {
			url: `${rmApi.getBaseApiUrl()}/gameserver/vehicles`,
			method: 'get',
		};

		const apiResults = await rmApi.makeApiCall(requestConfig);
		const {data: apiData} = apiResults;
		const vehicleData = apiData.data || null;
		return vehicleData;
	} catch (err) {
		console.log('Error', err);
	}
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
