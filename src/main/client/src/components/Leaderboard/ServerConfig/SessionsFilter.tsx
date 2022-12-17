import React, {useEffect, useState} from 'react';
const _ = require('lodash');

import {fetchSessions, fetchRotations, fetchServerConfig} from './utilities';

import {ISession, IRotation} from './interfaces';

import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Select, {SelectChangeEvent} from '@mui/material/Select';

interface IProps {
	currentSessionId: string,
	setCurrentSessionId: (sessionid:string) => void,
	currentRotationId: string,
	setCurrentRotationId: (rotationid:string) => void,
	serverName:string,
	setServerName: (serverName:string) => void,
	startDate:number,
	setStartDate: (startDate:number) => void,
	endDate: number,
	setEndDate: (endDate:number) => void,
	setLoading: (isLoading:boolean) => void
}

const StatsFilter = (props:IProps) => {
	const [sessions, setSessions] = useState<ISession[]>([]);
	const [rotations, setRotations] = useState<IRotation[]>([]);

	const setInitialState = async () => {
		await fetchServerConfig()
			.then(config => {
				if (config === undefined) {
					props.setLoading(false);
				}

				props.setCurrentSessionId(config?.activeRaceSessionId);
				props.setCurrentRotationId(config?.activeRaceRotationId);
				props.setServerName(config?.serverName);
			});
	};

	const getSessions = async () => {
		const sessions: ISession[] = await fetchSessions();
		setSessions(sessions);
	};

	const getRotations = async () => {
		const rotations: IRotation[] = await fetchRotations();
		setRotations(rotations);
	};

	useEffect(() => {
		getSessions();
		getRotations();
	}, []);

	useEffect(() => {
		setInitialState();
	}, [sessions]);

	const handleSessionChange = (event: SelectChangeEvent) => {
		props.setCurrentSessionId(event.target.value);
	};

	const handleRotationChange = (event: SelectChangeEvent) => {
		props.setCurrentRotationId(event.target.value);
	};

	const isGuid = (guid:string) => {
		const regEx = /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/;
		return regEx.test(guid);
	};

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={3}>
				<FormControl variant="standard" sx={{p: 1, m: 1, minWidth: 220}} size="small">
					<InputLabel id="session-select">Session</InputLabel>
					<Select
						labelId="session-select"
						id="session-select"
						value={props.currentSessionId ?? ''}
						label="Session"
						onChange={handleSessionChange}
					>
						<MenuItem value="All">
							<em>All Sessions</em>
						</MenuItem>
						{sessions?.map(td => <MenuItem key={td.id} value={td.id}>{ td.name}</MenuItem>)}
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={3}>
				<FormControl variant="standard" sx={{p: 1, m: 1, minWidth: 220}} size="small">
					<InputLabel id="rotation-select">Rotation</InputLabel>
					<Select
						labelId="rotation-select"
						id="rotation-select"
						value={props.currentRotationId ?? ''}
						label="Rotation"
						onChange={handleRotationChange}
					>
						<MenuItem value="All">
							<em>All Rotations</em>
						</MenuItem>
						{rotations?.map((td, idx) => <MenuItem key={td.id} value={td.id}>{isGuid(td.name) ? `Rotation ${idx + 1}` : td.name}</MenuItem>)}
					</Select>
				</FormControl>
			</Grid>
		</Grid>);
};

export default StatsFilter;
