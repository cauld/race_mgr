import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getServerConfig} from '../../state/serverConfig';
import {getServerStatus} from '../../state/serverStatus';
import {setSelectedSessionId} from '../../state/sessions';
import {setSelectedRotationId} from '../../state/rotations';

import ServerConfig from './ServerConfig';

import {Redirect, useHistory} from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import ApplyServerConfig from './ApplyServerConfig';

import Paper from '@mui/material/Paper';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {sanitizeString} from '../../utils/stringUtils';

import ReportProblemIcon from '@mui/icons-material/ReportProblem';

type notificationSeverity = 'success' | 'error';

interface IManageServerProps {
	isAuthenticated: boolean,
}

const ManageServer = (props:IManageServerProps) => {
	const {serverConfig, serverStatus, sessions, rotations, rotationDetail} = useSelector((state:any) => state);

	const [notificationIsOpen, setNotificationIsOpen] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [notificationSeverity, setNotificationSeverity] = useState<notificationSeverity>('success');

	const [serverName, setServerName] = useState('');

	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		dispatch(getServerStatus());
		dispatch(getServerConfig());
	}, [dispatch]);

	useEffect(() => {
		if (!serverName) {
			setServerName(serverConfig.serverName);
		}

		if (!sessions.selectedSessionId || sessions.selectedSessionId === 'All') {
			dispatch(setSelectedSessionId(serverConfig.activeRaceSessionId));
		}

		if (!rotations.selectedRotationId || rotations.selectedRotationId === 'All') {
			dispatch(setSelectedRotationId(serverConfig.activeRaceRotationId));
		}
	}, [serverConfig]);

	useEffect(() => {
		if (serverConfig.hasError === true) {
			history.push('/serverconfigError');
		}
	}, [serverConfig.hasError]);

	useEffect(() => {
		if (serverStatus.hasError === true) {
			history.push('/serverstatusError');
		}
	}, [serverStatus.hasError]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setServerName(sanitizeString(event.target.value));
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
		props.isAuthenticated === false ? <Redirect to="/login" />

			:		<Paper sx={{
				p: 2,
				pb: 5,
				display: 'flex',
				flexDirection: 'column',
			}}>
				<Typography variant="h5" align="left" gutterBottom={true}>
				Manage Server   <IconButton sx={{color: 'red', visibility: serverStatus.isRunning ? 'hidden' : 'visible'}}>

						<Tooltip title="Server is not Running">
							<ReportProblemIcon />
						</Tooltip>
					</IconButton>
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

					<ServerConfig />
				</Typography>

				<Typography variant="subtitle1" align="left" gutterBottom={true}>
					<ApplyServerConfig
						serverName={serverName}
						showNotification={showNotification}
						setIsServerRunning={serverStatus.isRunning}
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
					open={serverConfig.isLoading || serverStatus.isLoading || sessions.isLoading || rotations.isLoading || rotationDetail.isLoading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>

			</Paper>
	);
};

export default ManageServer;
