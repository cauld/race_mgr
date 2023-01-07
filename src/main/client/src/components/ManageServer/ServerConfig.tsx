import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
const _ = require('lodash');

import {fetchSessions, fetchRotations} from './utilities';
import {ISession, IRotation} from './interfaces';

import AddSessionDialog from './AddSessionDialog';
import AddRotationDialog from './AddRotationDialog';
import ViewRotationDialog from './ViewRotationDialog';

import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import Select, {SelectChangeEvent} from '@mui/material/Select';
import {Stack} from '@mui/material';
import {getSessions, setSelectedSessionId} from '../../state/sessions';
import {getRotations, setSelectedRotationId} from '../../state/rotations';

const ServerConfig = () => {
	const {serverStatus, sessions, rotations, serverConfig} = useSelector((state:any) => state);

	const [addSessionDialogIsOpen, setAddSessionDialogIsOpen] = useState(false);
	const [viewRotationDialogIsOpen, setViewRotationDialogIsOpen] = useState(false);
	const [addRotationDialogIsOpen, setAddRotationDialogIsOpen] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getSessions());
		dispatch(getRotations());
	}, [dispatch]);

	const handleSessionChange = (event: SelectChangeEvent) => {
		if (event.target.value !== sessions.selectedSessionId) {
			dispatch(setSelectedSessionId(event.target.value));
		}
	};

	const handleRotationChange = (event: SelectChangeEvent) => {
		if (event.target.value !== rotations.selectedRotationId) {
			dispatch(setSelectedRotationId(event.target.value));
		}
	};

	return (
		<Grid container spacing={3}>
			<Grid item xs={6}>
				<Grid item xs={6} sx={{height: '50px'}}>
					<FormControl variant="standard" sx={{p: 1, m: 1, minWidth: 320}} size="small">
						<InputLabel id="session-select">Session</InputLabel>
						<Select
							labelId="session-select"
							id="session-select"
							value={sessions.selectedSessionId}
							label="Session"
							onChange={handleSessionChange}
						>

							{sessions?.sessions?.map(td => <MenuItem key={td.id} value={td.id}>{ td.name}</MenuItem>)}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} md={6}>
					<FormControl variant="standard" sx={{p: 1, m: 1, minWidth: 320}} size="small">
						<Typography align="left">
							<Link
								component="button"
								variant="body2"
								underline="none"
								onClick={() => {
									setAddSessionDialogIsOpen(!addSessionDialogIsOpen);
								}}
							>
					Add Session
							</Link>
						</Typography>
					</FormControl>
				</Grid>
			</Grid>

			<Grid item xs={12} md={6}>
				<Grid item xs={12} sx={{height: '50px'}}>
					<FormControl variant="standard" sx={{p: 1, m: 1, minWidth: 320}} size="small">
						<InputLabel id="rotation-select">Rotation</InputLabel>
						<Select
							labelId="rotation-select"
							id="rotation-select"
							value={rotations.selectedRotationId}
							label="Rotation"
							onChange={handleRotationChange}
						>
							{rotations?.rotations?.map((td, idx) => <MenuItem key={td.id} value={td.id}>{td.name}</MenuItem>)}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<Stack direction="row">
						<FormControl variant="standard" sx={{p: 1, m: 1, display: serverStatus.isRunning ? 'inline' : 'none'}} size="small" >
							<Typography align="left">
								<Link
									component="button"
									variant="body2"
									underline="none"
									onClick={() => {
										setAddRotationDialogIsOpen(!addRotationDialogIsOpen);
									}}
								>
					Add Rotation <IconButton>
										<Tooltip title="Currently rotations are randomly generated and support a few options for customization (e.g.) avoid karts. Custom rotation building may be added in the future.">
											<InfoIcon />
										</Tooltip>
									</IconButton>
								</Link>
							</Typography>
						</FormControl>
						<FormControl variant="standard" sx={{p: 1, m: 1}} size="small">
							<Typography align="left">
								<Link
									sx={{marginTop: '9px'}}
									component="button"
									variant="body2"
									underline="none"
									onClick={() => {
										setViewRotationDialogIsOpen(!viewRotationDialogIsOpen);
									}}
								>
									View Rotation
								</Link>
							</Typography>
						</FormControl>
					</Stack>
				</Grid>

			</Grid>
			<Grid item md={12}>
				<AddSessionDialog open={addSessionDialogIsOpen} setOpen={setAddSessionDialogIsOpen} />
				<AddRotationDialog open={addRotationDialogIsOpen} setOpen={setAddRotationDialogIsOpen} />
				<ViewRotationDialog open={viewRotationDialogIsOpen} setOpen={setViewRotationDialogIsOpen} />
			</Grid>
		</Grid>);
};

export default ServerConfig;
