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
