import React, {useState, useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';

import {addRotation} from './utilities';
import {sanitizeString} from '../../utils/stringUtils';

import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

const ErrorTypography = withStyles({
	root: {
		color: 'red',
	},
})(Typography);

interface IProps {
    open: boolean,
    setOpen: (isOpen:false)=> void,
    isLoading: boolean,
	setIsLoading: (isLoading: boolean) => void,
	setNewRotationId: (rotationId:string) => void
}

const AddRotationDialog = (props:IProps) => {
	const [rotationName, setRotationName] = useState('');
	const [raceSize, setRaceSize] = useState(10);
	const [allowKarts, setAllowKarts] = useState(false);
	const [persist, setPersist] = useState(true);
	const [restart, setRestart] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	const handleClose = () => {
		props.setOpen(false);
		clearRotationName();
		props.setIsLoading(false);
	};

	const handleRotationNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRotationName(sanitizeString(event.target.value));
		setErrorMessage('');
	};

	const handleRaceSizeChange = (event: Event, newValue: number | number[]) => {
		setRaceSize(newValue as number);
	};

	const handleAllowKartsChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAllowKarts(event.target.checked);
	};

	const handlePersistChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPersist(event.target.checked);
	};

	const handleRestartChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRestart(event.target.checked);
	};

	const handleApply = () => {
		props.setIsLoading(true);
		addRotation({
			rotationName: sanitizeString(rotationName),
			raceSize,
			allowKarts,
			persist,
			restart,
		}).then(rotationId => {
			if (rotationId) {
				props.setNewRotationId(rotationId);
				handleClose();
			} else {
				setErrorMessage('Error adding rotation, make sure the Rotation Name is unique');
				props.setIsLoading(false);
			}
		});
	};

	const clearRotationName = () => {
		setRotationName('');
	};

	return (
		<div>
			<Dialog open={props.open} onClose={handleClose}>
				<DialogTitle>Add a Rotation</DialogTitle>
				<DialogContent sx={{minWidth: 600}}>
					<Grid container spacing={3} padding={3}>
						<Grid item xs={12}>
							<TextField
								inputProps={{maxLength: 50}}
								id="standard-basic"
								label="Rotation Name"
								variant="standard"
								fullWidth
								value={rotationName}
								required
								disabled={props.isLoading}
								onChange={handleRotationNameChange} />
						</Grid>
						<Grid item xs={12}>
							<Typography align="left" variant="subtitle1" sx={{minWidth: 100}}>Number of Races</Typography>
							<Slider
								size="small"
								getAriaLabel={() => 'Race Count'}
								value={raceSize}
								onChange={handleRaceSizeChange}
								min={0}
								max={32}
								valueLabelDisplay="auto"
								sx={{pt: 2}}
								disabled={props.isLoading}
								marks={[{value: 0, label: '0'}, {value: 32, label: '32'}]}

							/>

						</Grid>
						<Grid item xs={4}>
							<FormControlLabel
								control={
									<Switch disabled={props.isLoading} checked={allowKarts} onChange={handleAllowKartsChanged} name="allowKarts" />
								}
								label="Allow Karts"
							/>
						</Grid>

						<Grid item xs={4}>
							<FormControlLabel
								control={
									<Switch disabled={props.isLoading} checked={persist} onChange={handlePersistChanged} name="persist" />
								}
								label="Persist"
							/>

						</Grid>

						<Grid item xs={4}>
							<FormControlLabel
								control={
									<Switch disabled={props.isLoading} checked={restart} onChange={handleRestartChanged} name="restart" />
								}
								label="Restart"
							/>

						</Grid>

					</Grid>
					<ErrorTypography>
						{errorMessage}
					</ErrorTypography>

				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} disabled={props.isLoading}>Cancel</Button>
					<LoadingButton onClick={handleApply} loading={props.isLoading} disabled={rotationName.length === 0}>
							Add Rotation
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AddRotationDialog;
