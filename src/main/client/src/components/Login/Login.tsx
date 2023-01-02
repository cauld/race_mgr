import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';

import {doAuth} from './utilites';

import {Redirect} from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface ILoginProps {
	isAuthenticated: boolean,
	setIsAuthenticated: (isAuthenticated:boolean) => void
}

const ErrorTypography = withStyles({
	root: {
		color: 'red',
	},
})(Typography);

const Login = (props:ILoginProps) => {
	const [loading, setLoading] = useState(false);
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(event.target.value);
		setErrorMessage('');
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
		setErrorMessage('');
	};

	const handleLogin = () => {
		setLoading(true);
		try	{
			doAuth(userName, password).then(res => {
				if (res === 'OK') {
					props.setIsAuthenticated(true);
				} else {
					setErrorMessage('Invalid username or password');
					setLoading(false);
				}
			});
		} catch {
			setLoading(false);
			setErrorMessage('Login Error');
		}
	};

	return (

		props.isAuthenticated === true ? <Redirect to="/" />

			: <Paper sx={{
				p: 2,
				pb: 5,
				display: 'flex',
				flexDirection: 'column',
			}}>
				<Typography variant="h5" align="left" gutterBottom={true}>
				Login
				</Typography>

				<Typography variant="subtitle1" align="left" gutterBottom={true} maxWidth={500}>
					<TextField
						inputProps={{maxLength: 50}}
						id="standard-basic"
						label="UserName"
						variant="standard"
						fullWidth
						required={true}
						value={userName}
						onChange={handleUserNameChange}
					/>
				</Typography>

				<Typography variant="subtitle1" align="left" gutterBottom={true} maxWidth={500}>
					<TextField
						inputProps={{maxLength: 50}}
						id="standard-basic"
						label="Password"
						variant="standard"
						fullWidth
						required={true}
						value={password}
						type={'password'}
						onChange={handlePasswordChange}
					/>
				</Typography>

				<Typography variant="subtitle1" align="left" gutterBottom={true} maxWidth={500}>
					<ErrorTypography>
						{errorMessage}
					</ErrorTypography>
				</Typography>

				<Typography variant="subtitle1" align="left" gutterBottom={true} maxWidth={500}>
					<Button disabled={userName === '' || password === ''} variant="outlined" onClick={handleLogin}>Login</Button>
				</Typography>

				<Backdrop
					sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 1}}
					open={loading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>

			</Paper>
	);
};

export default Login;
