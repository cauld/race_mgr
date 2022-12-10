import React, {useState, useEffect} from 'react';

import {fetchServerConfig, doAuth} from './utilities';

import ServerConfig from './ServerConfig';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import SplitButton from './ApplyServerConfig';

import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles';

const Item = styled(Paper)(({theme}) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

const ManageServer:React.FC = () => {
	const [refreshing, setRefreshing] = useState(false);
	const [serverName, setServerName] = useState('');
	const [currentSessionId, setCurrentSessionId] = useState('');
	const [currentRotationId, setCurrentRotationId] = useState('');

	const setInitialState = async () => {
		await fetchServerConfig()
			.then(config => {
				setCurrentSessionId(config?.activeRaceSessionId);
				setCurrentRotationId(config?.activeRaceRotationId);
				setServerName(config?.serverName);
			});
	};

	useEffect(() => {
		setInitialState();
	}, []);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setServerName(event.target.value);
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
				<SplitButton
					serverName={serverName}
					currentSessionId={currentSessionId}
					currentRotationId={currentRotationId}></SplitButton>
			</Typography>

		</Paper>
	);
};

export default ManageServer;
