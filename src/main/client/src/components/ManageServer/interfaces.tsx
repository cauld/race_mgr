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
