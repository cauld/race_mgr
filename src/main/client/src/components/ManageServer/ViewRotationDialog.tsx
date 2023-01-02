import React, {useState, useEffect} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {getRotationDetail} from '../../state/rotationDetail';

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

interface IProps {
    open: boolean,
    setOpen: (isOpen:false)=> void
}

const ViewRotationDialog = (props:IProps) => {
	const {rotations, rotationDetail} = useSelector((state:any) => state);

	const dispatch = useDispatch();

	useEffect(() => {
		if (props.open === true) {
			dispatch(getRotationDetail(rotations.selectedRotationId));
		}
	}, [props.open]);

	const handleClose = () => {
		props.setOpen(false);
		// SetRotationDetail(undefined); // Set from Saga as well
	};

	return (
		<div>
			<Dialog open={props.open} onClose={handleClose}>
				<DialogTitle>{rotationDetail?.rotationDetail?.name}</DialogTitle>

				<DialogContent sx={{minWidth: 600, minHeight: 400}}>
					<Grid container spacing={0} padding={0}>
						<Grid item xs={12}>
							<Typography sx={{m: 0}} variant="h6" component="div">
							Vehicle Class: {rotationDetail?.rotationDetail?.vehicleClassId.replaceAll('_', ' ')}
							</Typography>
						</Grid>

						<Grid item xs={12}>
							<Typography sx={{mt: 2, fontWeight: 'bold'}} variant="subtitle1" component="div" align="left">
							Tracks
							</Typography>
							<List dense={true} sx={{visibility: rotationDetail.isLoading ? 'hidden' : ''}}>
								{
									rotationDetail?.rotationDetail?.rotations?.map((rotation, idx) =>
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
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} disabled={rotationDetail.isLoading}>Close</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ViewRotationDialog;
