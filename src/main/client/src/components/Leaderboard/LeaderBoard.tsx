
import React, {useEffect, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {getServerConfig} from '../../state/serverConfig';
import {getServerStatus} from '../../state/serverStatus';

import {getSessions, setSelectedSessionId} from '../../state/sessions';
import {getRotations, setSelectedRotationId} from '../../state/rotations';

import _ from 'lodash';

import {fetchRaceData} from './utilities';

import ServerStopped from '../ErrorStates/ServerStopped';

import AdvancedFiltersDialog from './AdvancedFiltersDialog';

import SessionsFilter from './ServerConfig/SessionsFilter';
import DateFilter from './DateFilter';
import RaceResults from './RaceResults';
import RaceSummary from './RaceSummary';

import {IRace} from './interfaces';
import {IAdvancedFilter} from './AdvancedFiltersDialog';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ServerConfigError from '../ErrorStates/ServerConfigError';

export const defaultAdvancedFilter:IAdvancedFilter = {
	humanPlayers: [0, 32],
	gridSize: [0, 32],
	aiStrength: [0, 100],
};

const LeaderBoard:React.FC = () => {
	const dispatch = useDispatch();
	const {serverConfig, serverStatus, sessions, rotations} = useSelector((state:any) => state);
	const [fetchingData, setFetchingData] = useState(false);

	// Filter State
	const [startDate, setStartDate] = useState(0);
	const [endDate, setEndDate] = useState(0);
	const [advancedFilterIsOpen, setAdvancedFilterIsOpen] = useState(false);
	const [advancedFilters, setAdvancedFilters] = useState<IAdvancedFilter>(defaultAdvancedFilter);

	const [selectedSessionId, setSelectedSessionId] = useState('');
	const [selectedRotationId, setSelectedRotationId] = useState('');

	const [races, setRaces] = useState<IRace[]>([]);
	const [filteredRaces, setFilteredRaces] = useState<IRace[]>([]);

	useEffect(() => {
		dispatch(getServerStatus());
		dispatch(getServerConfig());
		dispatch(getSessions());
		dispatch(getRotations());
	}, []);

	useEffect(() => {
		setSelectedSessionId(serverConfig.activeRaceSessionId);
	}, [serverConfig.activeRaceSessionId]);

	useEffect(() => {
		setSelectedRotationId(serverConfig.activeRaceRotationId);
	}, [serverConfig.activeRaceRotationId]);

	useEffect(() => {
		if (!selectedSessionId || !selectedRotationId) {
			setRaces([]);
			return;
		}

		setFetchingData(true);
		fetchRaceData(selectedSessionId, selectedRotationId).then(r => {
			const raceResults = (r as Array<IRace>)?.filter(r => r.finished === true);

			if (!raceResults || raceResults.length === 0) {
				setRaces([]);
				setFetchingData(false);
				return;
			}

			const sortedResults = _.orderBy(raceResults, ['startDate'], 'asc');
			const firstRace = sortedResults[0];
			const lastRace = sortedResults[raceResults.length - 1];

			setStartDate(firstRace?.startDate);
			setEndDate(lastRace?.endDate);
			setRaces(raceResults);
			setFetchingData(false);
		});
	}, [selectedRotationId, selectedSessionId]);

	useEffect(() => {
		let newResults = races.filter(r => r.startDate >= startDate && r.endDate <= endDate);
		newResults = newResults.filter(
			rr => rr.raceResults.filter(r => r.isPlayer === true).length >= advancedFilters.humanPlayers[0]
				&& rr.raceResults.filter(r => r.isPlayer === true).length <= advancedFilters.humanPlayers[1],
		);
		newResults = newResults.filter(nr => nr.aiStrength >= advancedFilters.aiStrength[0] && nr.aiStrength <= advancedFilters.aiStrength[1]);
		newResults = newResults.filter(nr => nr.gridSize >= advancedFilters.gridSize[0] && nr.gridSize <= advancedFilters.gridSize[1]);

		setFilteredRaces(newResults);
	}, [startDate, endDate, races, advancedFilters]);

	return (
		!serverStatus.isLoading && !serverStatus.isRunning ? <ServerStopped />
			:	!serverConfig.isLoading && (!serverConfig.activeRaceSessionId || !serverConfig.activeRaceRotationId) ? <ServerConfigError />

				: <Paper sx={{
					p: 2,
					pb: 5,
					display: 'flex',
					flexDirection: 'column',
				}}>
					<Typography variant="h5" align="left" gutterBottom={true}>
				Leader Board
					</Typography>

					<Typography variant="subtitle1" align="left" gutterBottom={true}>
						<SessionsFilter
							selectedSessionId={selectedSessionId}
							setSelectedSessionId={setSelectedSessionId}
							selectedRotationId={selectedRotationId}
							setSelectedRotationId={setSelectedRotationId}/>
					</Typography>

					<Typography variant="subtitle1" align="left" gutterBottom={true}>
						<DateFilter
							currentSessionId={serverConfig.activeRaceSessionId}
							startDate ={startDate}
							setStartDate={setStartDate}
							endDate ={endDate}
							setEndDate={setEndDate}
						/>
					</Typography>

					<Typography align="left">
						<Link
							component="button"
							variant="body2"
							underline="none"
							onClick={() => {
								setAdvancedFilterIsOpen(!advancedFilterIsOpen);
							}}
						>
					Advanced Filters
						</Link>
					</Typography>

					<Grid container spacing={3}>
						<Grid item xs={12} md={12} lg={12}>
							<Typography marginTop={'5px'} marginBottom={'5px'} variant="h6">
								{ filteredRaces.length} Races
							</Typography>
						</Grid>
					</Grid>

					<Grid container spacing={3} marginBottom={'25px'} marginTop={'-35px'}>
						<Grid item xs={12} md={12} lg={12} display={filteredRaces.length > 0 ? '' : 'none'}>
							<Typography variant="h6" align="left">Session Leaders</Typography>
							<RaceSummary filteredRaces={filteredRaces} />

						</Grid>
					</Grid>

					<Grid container spacing={3}>
						<Grid item xs={12} md={12} lg={12} display={filteredRaces.length > 0 ? '' : 'none'}>
							<Typography variant="h6" align="left">Race Summary</Typography>
							<RaceResults filteredRaces={filteredRaces}/>
						</Grid>
					</Grid>
					< AdvancedFiltersDialog open={advancedFilterIsOpen} setOpen={setAdvancedFilterIsOpen} advancedFilters={advancedFilters} setAdvancedFilters={setAdvancedFilters} />
					<Backdrop
						sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 1}}
						open={ fetchingData || serverConfig.isLoading || sessions.isLoading || rotations.isLoading }
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				</Paper>
	);
};

export default LeaderBoard;
