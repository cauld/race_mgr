import React, {useState, useEffect} from 'react';

import {fetchRotationDetail} from './utilities';

import {IRotationDetail} from './interfaces';

import {withStyles} from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

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
	rotationId: string
}

const ViewRotationDialog = (props:IProps) => {
	const [errorMessage, setErrorMessage] = useState('');
	const [rotationDetail, setRotationDetail] = useState<IRotationDetail>();

	const getRotationDetail = async () => {
		fetchRotationDetail(props.rotationId).then(res => {
			setRotationDetail(res);
		});
	};

	useEffect(() => {
		if (props.open === true) {
			getRotationDetail();
		}
	}, [props.open]);

	const handleClose = () => {
		props.setOpen(false);
		props.setIsLoading(false);
	};

	return (
		<div>
			<Dialog open={props.open} onClose={handleClose}>
				<DialogTitle>{rotationDetail?.name}</DialogTitle>

				<DialogContent sx={{minWidth: 600}}>
					<Grid container spacing={0} padding={0}>
						<Grid item xs={12}>
							<Typography sx={{m: 0}} variant="h6" component="div">
							Vehicle Class: {rotationDetail?.vehicleClassId.replaceAll('_', ' ')}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography sx={{mt: 2, fontWeight: 'bold'}} variant="subtitle1" component="div" align="left">
							Tracks
							</Typography>
							<List dense={true}>
								{
									rotationDetail?.rotations.map((rotation, idx) =>
										<ListItem key={idx}>
											<ListItemText
												primary={rotation.name.replaceAll('_', ' ')}
											/>
										</ListItem>,
									)
								}
							</List>
						</Grid>

					</Grid>
					<ErrorTypography align="left">
						{errorMessage}
					</ErrorTypography>

				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} disabled={props.isLoading}>Close</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ViewRotationDialog;
