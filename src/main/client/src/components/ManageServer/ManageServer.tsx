import React, {useState, useEffect} from 'react';

import {fetchServerConfig, doAuth} from './utilities';

import ServerConfig from './ServerConfig';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';

import ApplyServerConfig from './ApplyServerConfig';

import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

type notificationSeverity = 'success' | 'error';

const ManageServer:React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [notificationIsOpen, setNotificationIsOpen] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [notificationSeverity, setNotificationSeverity] = useState<notificationSeverity>('success');
	const [serverName, setServerName] = useState('');
	const [currentSessionId, setCurrentSessionId] = useState('');
	const [currentRotationId, setCurrentRotationId] = useState('');

	const setInitialState = async () => {
		setLoading(true);
		await fetchServerConfig()
			.then(config => {
				setCurrentSessionId(config?.activeRaceSessionId);
				setCurrentRotationId(config?.activeRaceRotationId);
				setServerName(config?.serverName);
			}).then(() => setLoading(false));
	};

	useEffect(() => {
		setInitialState();
	}, []);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setServerName(event.target.value);
	};

	const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setNotificationIsOpen(false);
	};

	const showNotification = (message:string, severity: notificationSeverity) => {
		setNotificationMessage(message);
		setNotificationSeverity(severity);
		setNotificationIsOpen(true);
	};

	return (
		<Paper sx={{
			p: 2,
			pb: 5,
			display: 'flex',
			flexDirection: 'column',
		}}>
			<Typography variant="h5" align="left" gutterBottom={true}>
				Manage Server
			</Typography>

			<Typography variant="subtitle1" align="left" gutterBottom={true} maxWidth={500}>
				<TextField
					inputProps={{maxLength: 50}}
					id="standard-basic"
					label="Server Name"
					variant="standard"
					fullWidth
					required={true}
					value={serverName}
					onChange={handleChange} />
			</Typography>

			<Typography variant="subtitle1" align="left" gutterBottom={true}>

				<ServerConfig
					setCurrentSessionId={setCurrentSessionId}
					currentSessionId={currentSessionId}
					currentRotationId={currentRotationId}
					setCurrentRotationId={setCurrentRotationId}
				/>
			</Typography>

			<Typography variant="subtitle1" align="left" gutterBottom={true}>
				<ApplyServerConfig
					serverName={serverName}
					currentSessionId={currentSessionId}
					currentRotationId={currentRotationId}
					showNotification={showNotification}
					setLoading={setLoading}
				></ApplyServerConfig>

			</Typography>

			<Snackbar
				anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
				open={notificationIsOpen}
				autoHideDuration={3000}
				onClose={handleClose}
			>
				<Alert severity={notificationSeverity}>{notificationMessage}</Alert>
			</Snackbar>

			<Backdrop
				sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 1}}
				open={loading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>

		</Paper>
	);
};

export default ManageServer;
