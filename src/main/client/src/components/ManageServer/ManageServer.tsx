import React, {useState} from 'react';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import {apiGetServerStatus, apiManageServer, apiSetNewRotation, apiGetRotation} from '../../api/manageServerApi';
import {List, ListItem} from '@material-ui/core';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SportsScoreIcon from '@mui/icons-material/SportsScore';

import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles';

interface IRotation {
	trackId: string
}

const Item = styled(Paper)(({theme}) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

const ManageServer:React.FC = () => {
	const [refreshing, setRefreshing] = useState(false);
	const [serverStatus, setserverStatus] = useState('Click Get Status');
	const [startingServer, setStartingServer] = useState(false);
	const [stoppingServer, setStoppingServer] = useState(false);
	const [restartingServer, setRestartServer] = useState(false);
	const [settingNewRotation, setSettingNewRotation] = useState(false);
	const [gettingRotation, getNewRotation] = useState(false);

	const [currentRotation, setCurrentRotation] = useState<IRotation[]>([]);

	const getServerStatus = () => {
		setRefreshing(true);
		const request = apiGetServerStatus();

		request.then(r => {
			const results = r.data.data.isRunning ? 'Server is Running' : 'Server is NOT Running';
			setserverStatus(results);
		}).catch(err => {
			setserverStatus('There was an Error');
		}).finally(() => {
			setRefreshing(false);
		});
	};

	const startServer = () => {
		setStartingServer(true);

		// Brandon - set the context here

		const request = apiManageServer('start');

		request.then(r => {
			const results = r.data.message;
			setserverStatus(results);
		}).catch(err => {
			setserverStatus('There was an Error Starting the Server' + err);
		}).finally(() => {
			setStartingServer(false);
		});
	};

	const stopServer = () => {
		setStoppingServer(true);

		const request = apiManageServer('stop');

		request.then(r => {
			const results = r.data.message;
			setserverStatus(results);
		}).catch(err => {
			setserverStatus('There was an Error Stopping the Server' + err);
		}).finally(() => {
			setStoppingServer(false);
		});
	};

	const restartServer = () => {
		setRestartServer(true);
		const request = apiManageServer('restart');

		request.then(r => {
			const results = r.data.message;
			setserverStatus(results);
		}).catch(err => {
			setserverStatus('There was an Error Restarting the Server' + err);
		}).finally(() => {
			setRestartServer(false);
		});
	};

	const setNewRotation = () => {
		setSettingNewRotation(true);
		const request = apiSetNewRotation();

		request.then(r => {
			const results = r.data.message;
			setserverStatus(results);
		}).catch(err => {
			setserverStatus('There was an Error Setting the rotation' + err);
		}).finally(() => {
			setSettingNewRotation(false);
		});
	};

	const getRotation = () => {
		getNewRotation(true);
		const request = apiGetRotation();

		request.then(r => {
			const rotationTrackList:Array<IRotation> = [];

			const trackList = '';
			for (const rotation in r.data.data.config.rotation) {
				const thisRotation = r.data.data.config.rotation[rotation];
				rotationTrackList.push({trackId: thisRotation.TrackId});
			}

			setserverStatus('Current Rotation');
			setCurrentRotation(rotationTrackList);
		}).catch(err => {
			setserverStatus('There was an Error Getting the rotation' + err);
		}).finally(() => {
			getNewRotation(false);
		});
	};

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
				Manage Server
				</Paper>
			</Grid>
		</Grid>);
};

export default ManageServer;
