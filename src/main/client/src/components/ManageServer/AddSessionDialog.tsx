import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';

import {sanitizeString} from '../../utils/stringUtils';

import {addSession, setSelectedSessionId} from '../../state/sessions';

import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {Typography} from '@material-ui/core';

const ErrorTypography = withStyles({
	root: {
		color: 'red',
	},
})(Typography);

interface IProps {
    open: boolean,
    setOpen: (isOpen:false)=> void
}

const AddSessionDialog = (props:IProps) => {
	const {sessions, serverConfig} = useSelector((state:any) => state);

	const [sessionName, setSessionName] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const dispatch = useDispatch();

	useEffect(() => {
		setErrorMessage('');
	}, [props.open]);

	useEffect(() => {
		// Updated when a new Session is Added
		if (sessions.selectedSessionId) {
			handleClose();
		}
	}, [sessions.selectedSessionId]);

	useEffect(() => {
		if (sessions.hasError === true) {
			setErrorMessage('Error adding session, make sure the Session Name is unique');
		}
	}, [sessions.hasError]);

	const handleClose = () => {
		props.setOpen(false);
		clearSessionName();
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSessionName(sanitizeString(event.target.value));
		setErrorMessage('');
	};

	const handleAddSession = () => {
		dispatch(addSession(sanitizeString(sessionName)));
	};

	const clearSessionName = () => {
		setSessionName('');
	};

	return (
		<div>
			<Dialog open={props.open} onClose={handleClose}>
				<DialogTitle>Add a Session</DialogTitle>
				<DialogContent sx={{minWidth: 600}}>
					<Grid container spacing={3} padding={3}>
						<TextField
							inputProps={{maxLength: 50}}
							id="standard-basic"
							label="Session Name"
							variant="standard"
							fullWidth
							required={true}
							value={sessionName}
							disabled={sessions.isLoading}
							onChange={handleChange} />
						<ErrorTypography>
							{errorMessage}
						</ErrorTypography>

					</Grid>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} disabled={sessions.isLoading}>Cancel</Button>
					<LoadingButton disabled={sessionName.length === 0} onClick={handleAddSession} loading={sessions.isLoading}>
							Add Session
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AddSessionDialog;
