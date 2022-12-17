import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';

import {addSession} from './utilities';
import {sanitizeString} from '../../utils/stringUtils';

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
    setOpen: (isOpen:false)=> void,
    isLoading: boolean,
	setIsLoading: (isLoading: boolean) => void
	setNewSessionId: (sessionId:string) => void
}

const AddSessionDialog = (props:IProps) => {
	const [sessionName, setSessionName] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const handleClose = () => {
		props.setOpen(false);
		clearSessionName();
		props.setIsLoading(false);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSessionName(sanitizeString(event.target.value));
		setErrorMessage('');
	};

	const handleApply = () => {
		props.setIsLoading(true);
		addSession(sanitizeString(sessionName)).then(sessionId => {
			if (sessionId) {
				props.setNewSessionId(sessionId);
				handleClose();
			} else {
				setErrorMessage('Error adding session, make sure the Session Name is unique');
				props.setIsLoading(false);
			}
		});
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
							disabled={props.isLoading}
							onChange={handleChange} />
						<ErrorTypography>
							{errorMessage}
						</ErrorTypography>

					</Grid>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} disabled={props.isLoading}>Cancel</Button>
					<LoadingButton disabled={sessionName.length === 0} onClick={handleApply} loading={props.isLoading}>
							Add Session
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AddSessionDialog;
