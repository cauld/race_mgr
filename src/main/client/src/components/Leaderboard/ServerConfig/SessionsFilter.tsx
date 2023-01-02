import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

const _ = require('lodash');

import {updateServerConfig} from '../../../state/serverConfig';

import {ISession, IRotation} from './interfaces';

import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Select, {SelectChangeEvent} from '@mui/material/Select';
import {getSessions, setSelectedSessionId} from '../../../state/sessions';
import {getRotations, setSelectedRotationId} from '../../../state/rotations';
import {fetchSessionDetail} from '../../ManageServer/utilities';

const StatsFilter = () => {
	const {serverConfig, sessions, rotations} = useSelector((state:any) => state);

	const [filteredRotations, setFilteredRotaions] = useState<Array<IRotation>>([]);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getSessions());
		dispatch(getRotations());
	}, []);

	useEffect(() => {
		dispatch(setSelectedSessionId(serverConfig.activeRaceSessionId));
		dispatch(setSelectedRotationId(serverConfig.activeRaceRotationId));
	}, [serverConfig]);

	const handleSessionChange = (event: SelectChangeEvent) => {
		dispatch(setSelectedSessionId(event.target.value));
	};

	const handleRotationChange = (event: SelectChangeEvent) => {
		dispatch(setSelectedRotationId(event.target.value));
	};

	useEffect(() => {
		fetchSessionDetail(sessions.selectedSessionId).then(r => {
			const rotationsForActiveSession = rotations?.rotations.filter(element => r.raceRotationIds.includes(element.id));

			setFilteredRotaions(rotationsForActiveSession);
		});
	}, [sessions.selectedSessionId, rotations]);

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={3}>
				<FormControl variant="standard" sx={{p: 1, m: 1, minWidth: 220}} size="small">
					<InputLabel id="session-select">Session</InputLabel>
					<Select
						labelId="session-select"
						id="session-select"
						value={sessions.selectedSessionId ?? ''}
						label="Session"
						onChange={handleSessionChange}
					>
						<MenuItem value="All">
							<em>All Sessions</em>
						</MenuItem>
						{sessions?.sessions?.map(td => <MenuItem key={td.id} value={td.id}>{ td.name}</MenuItem>)}
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12} md={3}>
				<FormControl variant="standard" sx={{p: 1, m: 1, minWidth: 220}} size="small">
					<InputLabel id="rotation-select">Rotation</InputLabel>
					<Select
						labelId="rotation-select"
						id="rotation-select"
						value={rotations.selectedRotationId ?? ''}
						label="Rotation"
						onChange={handleRotationChange}
					>
						<MenuItem value="All">
							<em>All Rotations</em>
						</MenuItem>
						{filteredRotations?.map((td, idx) => <MenuItem key={td.id} value={td.id}>{td.name}</MenuItem>)}
					</Select>
				</FormControl>
			</Grid>
		</Grid>);
};

export default StatsFilter;
