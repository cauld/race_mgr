export interface ISession {
	id: string,
	name: string,
	startDate: number, // Epoch
	finished: boolean
}

export interface IRotation {
	id: string,
	name: string
}

export interface IRace {
	trackName: string,
	startDate: number,
	endDate: number,
	gridSize: number,
	laps: number,
	aiStrength: number,
	finished: boolean
	polePosition: string,
	fastestLap: string,
	winner: string,
	participants: Array<string>,
	raceResults: Array<IRaceResults>,
	qualifyingResults: Array<IRaceResults>,

}

export interface IRaceResults {
	participantid: string,
	driverName: string,
	isPlayer: boolean,
	finishPosition: number,
	vehicleId: string,
	bestQualifyingTime: number,
	fastestLapTime: number,
	totalTime: number,
	totalPoints: number,
	tookPole: boolean,
	hadFastestLap: boolean,
}
