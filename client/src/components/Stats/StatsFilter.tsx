import React, {useEffect, useState} from 'react';

const _ = require('lodash');

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Stack from '@mui/material/Stack';

import api from '../../api/baseApi';
import {ISessionData} from '../../interfaces/apiInterfaces';

import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';

import Typography from '@mui/material/Typography';
import {usePreviousProps} from '@mui/utils';
import {convertEpoch, convertEpochDate} from '../../utils/epochUtils';

interface IProps {
	currentSession: string,
	setCurrentSession: (sessionId:string) => void,
	startDate:string,
	setStartDate: (startDate:string) => void,
	endDate: string,
	setEndDate: (endDate:string) => void
}

const StatsFilter = (props:IProps) => {
	const [sessions, setSessions] = useState<ISessionData[]>([]);

	let currentSessions:Array<ISessionData> = [];

	const fetchSessions = async () => {
		try {
			const response = await api.get('/race/session?page=0&limit=1000');
			currentSessions = response.data.data.content;
			setSessions(currentSessions);
		} catch (err) {
			console.log('Error', err);
		}
	};

	const setInitialState = () => {
		const sortedSessions = _.orderBy(currentSessions, ['created'], ['desc']);
		const lastSession = sortedSessions[0];

		props.setCurrentSession(lastSession.id);
	};

	useEffect(() => {
		fetchSessions().then(() => {
			setInitialState();
		});
	}, []);

	const handleChange = (event: SelectChangeEvent) => {
		props.setCurrentSession(event.target.value);
	};

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={6}>
				<FormControl sx={{m: 1, minWidth: 220}} size="small">
					<InputLabel id="session-select">Session</InputLabel>
					<Select
						labelId="session-select"
						id="session-select"
						value={props.currentSession}
						label="Session"
						onChange={handleChange}
					>
						<MenuItem value="All">
							<em>All Sessions</em>
						</MenuItem>
						{
							sessions.map(td => <MenuItem key={td.id} value={td.id}>{td.name}</MenuItem>)
						}
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={3}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						label="Start Date"
						value={props.startDate}
						onChange={newValue => {
							props.setStartDate(newValue ?? '');
						}}
						renderInput={params => <TextField {...params} />}
					/>
				</LocalizationProvider>
			</Grid>
			<Grid item xs={12} md={3}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						label="End Date"
						value={props.endDate}
						onChange={newValue => {
							props.setEndDate(newValue ?? '');
						}}
						renderInput={params => <TextField {...params} />}
					/>
				</LocalizationProvider>
			</Grid>
		</Grid>);
};

export default StatsFilter;
