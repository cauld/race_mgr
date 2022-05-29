import React, {useState, useEffect} from 'react';
import _ from 'lodash';

import {IRace} from './interfaces';

import {styled} from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

interface IProps {
    filteredRaces: Array<IRace>;
}

interface IPlayerSummary {
    totalRaces: number,
    name:string,
	isPlayer: boolean,
    firstPlaceFinishes: number,
    secondPlaceFinishes:number,
    thirdPlaceFinishes:number,
    numberOfPodiums: number,
    numberOfPolePositions: number,
    numberOfFastestLaps: number,
    totalPoints:number
}

const DEFAULT_SUMMARY_COUNT = 5;

const StyledTableCell = styled(TableCell)(({theme}) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: '#EFF3F7',
	},
	// Hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

const getTotalPointsForDriver = (driverName:string, races: Array<IRace>) => {
	const points:Array<number> = [];
	races.forEach(race => {
		points.push(race.raceResults.filter(rr => rr.driverName === driverName)[0]?.totalPoints);
	});

	return _.sum(points);
};

const getParticipantList = (filteredRaces: Array<IRace>):Array<string> => {
	const results:Array<string> = [];

	filteredRaces.forEach(race => {
		race.participants.forEach(part => {
			if (!results.includes(part)) {
				results.push(part);
			}
		});
	});

	return results;
};

const isPlayer = (driverName:string):boolean => {
	if (driverName.slice(-4) !== '(AI)') {
		return true;
	}

	return false;
};

const generateRaceSummary = (filteredRaces: Array<IRace>):Array<IPlayerSummary> => {
	const playerSummary:Array<IPlayerSummary> = [];

	getParticipantList(filteredRaces).forEach(p => {
		const participantSummary: IPlayerSummary = {
			isPlayer: isPlayer(p),
			totalRaces: filteredRaces.filter(r =>
				p === r.raceResults.filter(rr => rr.driverName === p)[0]?.driverName,
			).length,
			name: p,
			firstPlaceFinishes: filteredRaces.filter(r =>
				p === r.raceResults.filter(rr => rr.driverName === p && rr.finishPosition === 1)[0]?.driverName,
			).length,
			secondPlaceFinishes: filteredRaces.filter(r =>
				p === r.raceResults.filter(rr => rr.driverName === p && rr.finishPosition === 2)[0]?.driverName,
			).length,
			thirdPlaceFinishes: filteredRaces.filter(r =>
				p === r.raceResults.filter(rr => rr.driverName === p && rr.finishPosition === 3)[0]?.driverName,
			).length,
			numberOfPodiums: filteredRaces.filter(r =>
				p === r.raceResults.filter(rr =>
					rr.driverName === p
                    && (rr.finishPosition === 1 || rr.finishPosition === 2 || rr.finishPosition === 3),
				)[0]?.driverName,
			).length,
			numberOfPolePositions: filteredRaces.filter(fr => fr.polePosition === p).length,
			numberOfFastestLaps: filteredRaces.filter(fr => fr.fastestLap === p).length,
			totalPoints: getTotalPointsForDriver(p, filteredRaces),
		};
		playerSummary.push(participantSummary);
	});
	return playerSummary;
};

const RaceSummary = (props:IProps) => {
	const [maxSummary, setMaxSummary] = useState(3);

	useEffect(() => {
		setMaxSummary(DEFAULT_SUMMARY_COUNT);
	}, [props.filteredRaces]);

	return (<Box marginTop={'10px'}>
		<TableContainer component={Paper}>
			<Table sx={{minWidth: 650}} aria-label="Race Summary" size="small">
				<TableHead>
					<StyledTableRow>
						<StyledTableCell></StyledTableCell>
						<StyledTableCell>Races</StyledTableCell>
						<StyledTableCell >Driver</StyledTableCell >
						<StyledTableCell align="right">Wins</StyledTableCell>
						<StyledTableCell align="right">Seconds</StyledTableCell>
						<StyledTableCell align="right">Thirds</StyledTableCell>
						<StyledTableCell align="right">Podiums</StyledTableCell>
						<StyledTableCell align="right">Poles</StyledTableCell>
						<StyledTableCell align="right">Fastest Laps</StyledTableCell>
						<StyledTableCell align="right">Total Points</StyledTableCell>
					</StyledTableRow>
				</TableHead>
				<TableBody>
					{_.take(_.orderBy(generateRaceSummary(props.filteredRaces), ['totalPoints'], ['desc']), maxSummary).map((row:any, idx:number) => (
						<StyledTableRow
							key={row.name}
							sx={{'&:last-child td, &:last-child th': {border: 0}}}
						>
							<StyledTableCell component="th" scope="row">
								{idx + 1}
							</StyledTableCell>
							<StyledTableCell component="th" scope="row">
								{row.totalRaces}
							</StyledTableCell>
							<StyledTableCell component="th" scope="row" sx={{
								fontWeight: '',
								...(row.isPlayer && {
									fontWeight: 'bold',
								}),
							}}>
								{row.name.substring(0, 30)}
							</StyledTableCell>
							<StyledTableCell align="right">{row.firstPlaceFinishes}</StyledTableCell>
							<StyledTableCell align="right">{row.secondPlaceFinishes}</StyledTableCell>
							<StyledTableCell align="right">{row.thirdPlaceFinishes}</StyledTableCell>
							<StyledTableCell align="right">{row.numberOfPodiums}</StyledTableCell>

							<StyledTableCell align="right">{row.numberOfPolePositions}</StyledTableCell>
							<StyledTableCell align="right">{row.numberOfFastestLaps}</StyledTableCell>
							<StyledTableCell align="right">{row.totalPoints}</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
		<Typography align="left">
			<Link
				component="button"
				variant="body2"
				underline="none"
				onClick={() => {
					setMaxSummary(maxSummary === DEFAULT_SUMMARY_COUNT ? 10000 : DEFAULT_SUMMARY_COUNT);
				}}
			>
				{maxSummary === DEFAULT_SUMMARY_COUNT ? 'Show More' : 'Show Less'}
			</Link>
		</Typography>
	</Box>);
};

export default RaceSummary;
