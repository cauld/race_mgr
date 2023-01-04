import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const _ = require('lodash');

import {IRotation} from './interfaces';

import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Select, {SelectChangeEvent} from '@mui/material/Select';
import {fetchSessionDetail} from '../../ManageServer/utilities';

interface IProps {
    selectedSessionId: string,
    setSelectedSessionId: (selectedSessionId:string)=> void,
	selectedRotationId: string,
    setSelectedRotationId: (selectedRotationId:string)=> void
}
const StatsFilter = (props:IProps) => {
	const {serverConfig, sessions, rotations} = useSelector((state:any) => state);

	const [filteredRotations, setFilteredRotations] = useState<Array<IRotation>>([]);

	const handleSessionChange = (event: SelectChangeEvent) => {
		props.setSelectedSessionId(event.target.value);
		props.setSelectedRotationId('');
	};

	const handleRotationChange = (event: SelectChangeEvent) => {
		props.setSelectedRotationId(event.target.value);
	};

	const filterRotations = () => {
		if (sessions.isLoading || rotations.isLoading || sessions.sessions?.length === 0) {
			return;
		}

		if (props.selectedSessionId === 'All') {
			setFilteredRotations(rotations?.rotations);
			props.setSelectedRotationId('All');
		} else if (props.selectedSessionId && props.selectedSessionId !== 'All') {
			fetchSessionDetail(props.selectedSessionId).then(r => {
				const filteredRotations = rotations?.rotations?.filter(rot => r?.raceRotationIds?.includes(rot.id));

				setFilteredRotations(filteredRotations);

				// If the selected rotationId is not in the list, set to All
				if (!rotations.isLoading && !filteredRotations.find(fr => fr.id === props.selectedRotationId)) {
					props.setSelectedRotationId('All');
				}
			});
		} else {
			console.log('***** Brandon ***** sessions', props.selectedSessionId, props.selectedRotationId);
		}
	};

	useEffect(() => {
		filterRotations();
	}, [props.selectedSessionId]);

	useEffect(() => {
		filterRotations();
	}, [rotations.rotations]);

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={3}>
				<FormControl variant="standard" sx={{p: 1, m: 1, minWidth: 220}} size="small">
					<InputLabel id="session-select">Session</InputLabel>
					<Select
						labelId="session-select"
						id="session-select"
						value={props.selectedSessionId ?? ''}
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
						value={props.selectedRotationId ?? ''}
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
