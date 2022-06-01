import React, {useEffect, useState} from 'react';
const _ = require('lodash');

import {fetchSessions, fetchServerConfig} from './utilities';

import {ISession} from './interfaces';

import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Select, {SelectChangeEvent} from '@mui/material/Select';

interface IProps {
	currentSessionId: string,
	setCurrentSessionId: (sessionid:string) => void,
	startDate:number,
	setStartDate: (startDate:number) => void,
	endDate: number,
	setEndDate: (endDate:number) => void
}

const StatsFilter = (props:IProps) => {
	const [sessions, setSessions] = useState<Array<ISession>>([]);

	const setInitialState = () => {
		fetchServerConfig()
			.then(config =>
				props.setCurrentSessionId(config?.activeRaceSessionId),
			);
	};

	useEffect(() => {
		fetchSessions()
			.then(s => setSessions(s as Array<ISession>));
	}, []);

	useEffect(() => {
		setInitialState();
	}, [sessions]);

	const handleChange = (event: SelectChangeEvent) => {
		props.setCurrentSessionId(event.target.value);
	};

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={6}>
				<FormControl variant="standard" sx={{p: 1, m: 1, minWidth: 220}} size="small">
					<InputLabel id="session-select">Session</InputLabel>
					<Select
						labelId="session-select"
						id="session-select"
						value={props.currentSessionId ?? ''}
						label="Session"
						onChange={handleChange}
					>
						<MenuItem value="All">
							<em>All Sessions</em>
						</MenuItem>						{
							sessions?.map(td => <MenuItem key={td.id} value={td.id}>{td.name}</MenuItem>)
						}
					</Select>
				</FormControl>
			</Grid>
		</Grid>);
};

export default StatsFilter;
