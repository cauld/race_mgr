export interface IServerConfig {
    serverName: string,
    activeRaceSessionId:string,
    activeRaceRotationId:string
}

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

export interface IRotationTrackInfo {
	name:string,
}

export interface IRotationDetail {
	id: string,
	name: string,
	vehicleClassId: string,
	rotations: Array<IRotationTrackInfo> // TrackId
}

export interface IAddRotation {
	rotationName: string,
	raceSize: number,
	allowKarts: boolean,
	persist: boolean,
	restart: boolean
}
