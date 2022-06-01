import React from 'react';
const _ = require('lodash');

import {convertEpochDate} from '../../utils/epochUtils';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';

interface IProps {
	currentSessionId: string,
	startDate:number,
	setStartDate: (startDate:number) => void,
	endDate: number,
	setEndDate: (endDate:number) => void
}

const DateFilter = (props:IProps) => (
	<Box display={props.startDate > 0 ? '' : 'none'}>
		<Grid container spacing={3} hidden={true}>
			<Grid item xs={12} md={3}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						label="Start Date"
						value={convertEpochDate(props.startDate)}
						onChange={newValue => {
							props.setStartDate(Date.parse(newValue ?? '') / 1000);
						}}
						renderInput={params => <TextField {...params} />}
					/>
				</LocalizationProvider>
			</Grid>
			<Grid item xs={12} md={3}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						label="End Date"
						value={convertEpochDate(props.endDate)}
						onChange={newValue => {
							props.setEndDate(Date.parse(newValue ?? '') / 1000);
						}}
						renderInput={params => <TextField {...params} />}
					/>
				</LocalizationProvider>
			</Grid>
		</Grid>
	</Box>);

export default DateFilter;
