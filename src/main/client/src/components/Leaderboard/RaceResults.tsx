import React, {useState, useEffect} from 'react';
import _ from 'lodash';

import {IRace} from './interfaces';
import {ITrackData, IVehicleData} from '../../interfaces/asm2Interfaces';

import {convertEpochDate, convertEpochTime} from '../../utils/epochUtils';
import {convertEpochTimeToRaceResult} from '../../utils/dateTimeUtils';

import {fetchTrackData, fetchVehicleData} from './utilities';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface IProps {
    filteredRaces: Array<IRace>;
}

function Row(props: { row: IRace, trackData: Array<ITrackData>, vehicleData: Array<IVehicleData> }) {
	const {row} = props;
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{ props.trackData.filter(td => td.id === row.trackName)[0]?.name.replaceAll('_', ' ') }
				</TableCell>
				<TableCell component="th" scope="row">
					{convertEpochDate(row.startDate)}
				</TableCell>
				<TableCell component="th" scope="row">
					{convertEpochTime(row.startDate)}
				</TableCell>
				<TableCell component="th" scope="row">
					{convertEpochTime(row.endDate)}
				</TableCell>
				<TableCell align="right">{row.gridSize}</TableCell>
				<TableCell align="right">{row.laps}</TableCell>
				<TableCell align="right">{row.aiStrength}</TableCell>
				<TableCell align="right">{row.polePosition}</TableCell>
				<TableCell align="right">{row.fastestLap}</TableCell>
				<TableCell align="right">{row.winner}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={12}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{margin: 1}}>
							<Typography variant="h6" gutterBottom component="div">
								Race Results
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell align="left">Finish</TableCell>
										<TableCell>Driver</TableCell>
										<TableCell>Vehicle</TableCell>
										<TableCell align="right">Best Qualifying Time</TableCell>
										<TableCell align="right">Best Lap Time</TableCell>
										<TableCell align="right">Total Time</TableCell>
										<TableCell align="right">Points</TableCell>

									</TableRow>
								</TableHead>
								<TableBody>
									{
										row.raceResults?.map(raceResult => (<TableRow key={raceResult.driverName}>
											<TableCell align="left">{raceResult.finishPosition}
											</TableCell>
											<TableCell component="th" scope="row"
												sx={{
													fontWeight: '',
													...(raceResult.isPlayer && {
														fontWeight: 'bold',
													}),
												}}>
												{raceResult.driverName.substring(0, 30)}
											</TableCell>
											<TableCell>
												{ props.vehicleData.filter(vd => vd.id === raceResult.vehicleId)[0]?.name}
											</TableCell>
											<TableCell align="right" sx={{
												fontWeight: '',
												...(row.qualifyingResults?.filter(q => q.driverName === raceResult.driverName)[0].tookPole === true && {
													fontWeight: 'bold',
												}),
											}}>
												{row.qualifyingResults?.filter(q => q.driverName === raceResult.driverName)[0].tookPole ? '*' : ''}
												{convertEpochTimeToRaceResult(row.qualifyingResults?.filter(q => q.driverName === raceResult.driverName)[0].bestQualifyingTime)}
											</TableCell>
											<TableCell align="right" sx={{
												fontWeight: '',
												...(row.raceResults?.filter(q => q.driverName === raceResult.driverName)[0].hadFastestLap === true && {
													fontWeight: 'bold',
												}),
											}}>
												{row.raceResults?.filter(q => q.driverName === raceResult.driverName)[0].hadFastestLap ? '*' : ''}
												{convertEpochTimeToRaceResult(raceResult.fastestLapTime)}
											</TableCell>
											<TableCell align="right">{convertEpochTimeToRaceResult(raceResult.totalTime) }</TableCell>
											<TableCell align="right">{raceResult.totalPoints}</TableCell>
										</TableRow>))
									}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

const RaceResults = (props:IProps) => {
	const [trackData, setTrackData] = React.useState<Array<ITrackData>>([]);
	const [vehicleData, setVehicleData] = React.useState<Array<IVehicleData>>([]);

	useEffect(() => {
		fetchTrackData().then(td => setTrackData(td));
		fetchVehicleData().then(vd => setVehicleData(vd));
	}, []);

	return (
		<Box marginTop={'10px'}>
			<TableContainer component={Paper}>
				<Table size="small" aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>Track</TableCell>
							<TableCell>Start Date</TableCell>
							<TableCell>Start Time</TableCell>
							<TableCell>End Time</TableCell>
							<TableCell align="right">Grid Size</TableCell>
							<TableCell align="right">Laps</TableCell>
							<TableCell align="right">AI Strength</TableCell>
							<TableCell align="right">Pole Position</TableCell>
							<TableCell align="right">Fastest Lap</TableCell>
							<TableCell align="right">Winner</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{_.orderBy(props.filteredRaces, ['startDate'], ['desc']).map((row, key) => (
							<Row key={key} row={row} trackData={trackData} vehicleData={vehicleData} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default RaceResults;
