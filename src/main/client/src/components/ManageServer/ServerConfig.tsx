import React, {useEffect, useState} from 'react';
const _ = require('lodash');

import {fetchSessions, fetchRotations} from './utilities';
import {ISession, IRotation} from './interfaces';

import AddSessionDialog from './AddSessionDialog';
import AddRotationDialog from './AddRotationDialog';

import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import FormControl from '@mui/material/FormControl';

import Select, {SelectChangeEvent} from '@mui/material/Select';
import {Stack} from '@mui/material';

interface IProps {
	currentSessionId: string,
	setCurrentSessionId: (sessionid:string) => void,
	currentRotationId: string,
	setCurrentRotationId: (rotationid:string) => void,
	isLoading: boolean,
	setIsLoading: (isLoading: boolean) => void
}

const ServerConfig = (props:IProps) => {
	const [sessions, setSessions] = useState<ISession[]>([]);
	const [rotations, setRotations] = useState<IRotation[]>([]);
	const [addSessionDialogIsOpen, setAddSessionDialogIsOpen] = useState(false);
	const [addRotationDialogIsOpen, setAddRotationDialogIsOpen] = useState(false);
	const [newSessionId, setNewSessionId] = useState('');
	const [newRotationId, setNewRotationId] = useState('');

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
		if (!newSessionId) {
			return;
		}

		getSessions().then(() => {
			props.setCurrentSessionId(newSessionId);
		});
	}, [newSessionId]);

	useEffect(() => {
		if (!newRotationId) {
			return;
		}

		getRotations().then(() => {
			props.setCurrentRotationId(newRotationId);
		});
	}, [newRotationId]);

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
			<Grid item xs={6}>
				<Grid item xs={6} sx={{height: '50px'}}>
					<FormControl variant="standard" sx={{p: 1, m: 1, minWidth: 320}} size="small">
						<InputLabel id="session-select">Session</InputLabel>
						<Select
							labelId="session-select"
							id="session-select"
							value={props.currentSessionId}
							label="Session"
							onChange={handleSessionChange}
						>
							{sessions?.map(td => <MenuItem key={td.id} value={td.id}>{ td.name}</MenuItem>)}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
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

			<Grid item xs={6}>
				<Grid item xs={12} sx={{height: '50px'}}>
					<FormControl variant="standard" sx={{p: 1, m: 1, minWidth: 320}} size="small">
						<InputLabel id="rotation-select">Rotation</InputLabel>
						<Select
							labelId="rotation-select"
							id="rotation-select"
							value={props.currentRotationId}
							label="Rotation"
							onChange={handleRotationChange}
						>
							{rotations?.map((td, idx) => <MenuItem key={td.id} value={td.id}>{isGuid(td.name) ? `Rotation ${idx + 1}` : td.name}</MenuItem>)}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<Stack direction="row">
						<FormControl variant="standard" sx={{p: 1, m: 1}} size="small">
							<Typography align="left">
								<Link
									component="button"
									variant="body2"
									underline="none"
									onClick={() => {
										setAddRotationDialogIsOpen(!addRotationDialogIsOpen);
									}}
								>
					Add Rotation
								</Link>
							</Typography>
						</FormControl>
						<FormControl variant="standard" sx={{p: 1, m: 1}} size="small">
							<Typography align="left">
								<Link
									component="button"
									variant="body2"
									underline="none"
									onClick={() => {
										setAddSessionDialogIsOpen(!addSessionDialogIsOpen);
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
				<AddSessionDialog setNewSessionId={setNewSessionId} open={addSessionDialogIsOpen} setOpen={setAddSessionDialogIsOpen} isLoading={props.isLoading} setIsLoading={props.setIsLoading} />
				<AddRotationDialog setNewRotationId={setNewRotationId} open={addRotationDialogIsOpen} setOpen={setAddRotationDialogIsOpen} isLoading={props.isLoading} setIsLoading={props.setIsLoading} />
			</Grid>
		</Grid>);
};

export default ServerConfig;
