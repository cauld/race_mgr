import React, {useState, useEffect} from 'react';

import {defaultAdvancedFilter} from './LeaderBoard';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Link from '@mui/material/Link';
import {Typography} from '@mui/material';

interface IProps {
    open: boolean,
    setOpen: (isOpen:false)=> void,
    advancedFilters: IAdvancedFilter,
    setAdvancedFilters: (advancedFilters: IAdvancedFilter) => void
}

export interface IAdvancedFilter {
    humanPlayers: number[];
	gridSize: number [];
    aiStrength: number[];
}

const AdvancedFiltersDialog = (props:IProps) => {
	const [newFilter, setNewFilter] = useState<IAdvancedFilter>(props.advancedFilters);

	const handleClose = () => {
		setNewFilter(props.advancedFilters); // Reset any unsaved changes
		props.setOpen(false);
	};

	const handleApply = () => {
		props.setAdvancedFilters(newFilter);
		props.setOpen(false);
	};

	const handleMinHumansChange = (event: Event, newValue: number | number[]) => {
		const currentFilter = {...newFilter, humanPlayers: newValue};
		setNewFilter(currentFilter as IAdvancedFilter);
	};

	const handleAiStrengthChange = (event: Event, newValue: number | number[]) => {
		const currentFilter = {...newFilter, aiStrength: newValue};
		setNewFilter(currentFilter as IAdvancedFilter);
	};

	const handleGridSizeChange = (event: Event, newValue: number | number[]) => {
		const currentFilter = {...newFilter, gridSize: newValue};
		setNewFilter(currentFilter as IAdvancedFilter);
	};

	useEffect(() => {
		setNewFilter(props.advancedFilters);
	}, []);

	return (
		<div>
			<Dialog open={props.open} onClose={handleClose}>
				<DialogTitle>Advanced Filters</DialogTitle>
				<DialogContent sx={{minWidth: 500}}>
					<Grid container spacing={3} padding={3}>
						<Grid item xs={12} md={12} lg={12}>
							<Stack spacing={2} direction="row" sx={{mb: 2}} alignItems="center">
								<Typography align="left" variant="subtitle1" sx={{minWidth: 100}}>Humans</Typography>
								<Slider
									size="small"
									getAriaLabel={() => 'Number of Human Player'}
									value={newFilter.humanPlayers}
									onChange={handleMinHumansChange}
									min={0}
									max={32}
									valueLabelDisplay="auto"
									sx={{pt: 2}}
									marks={[{value: 0, label: '0'}, {value: 32, label: '32'}]}
								/>
							</Stack>
						</Grid>

						<Grid item xs={12} md={12} lg={12}>
							<Stack spacing={2} direction="row" sx={{mb: 2}} alignItems="center">
								<Typography align="left" variant="subtitle1" sx={{minWidth: 100}}>Grid Size</Typography>
								<Slider
									size="small"
									getAriaLabel={() => 'Grid Size'}
									value={newFilter.gridSize}
									onChange={handleGridSizeChange}
									min={0}
									max={32}
									valueLabelDisplay="auto"
									sx={{pt: 2}}
									marks={[{value: 0, label: '0'}, {value: 32, label: '32'}]}

								/>
							</Stack>
						</Grid>

						<Grid item xs={12} md={12} lg={12}>
							<Stack spacing={2} direction="row" sx={{mb: 1}} alignItems="center">
								<Typography align="left" variant="subtitle1" sx={{minWidth: 100}}>AI Strength</Typography>
								<Slider
									size="small"
									getAriaLabel={() => 'AI Strength'}
									value={newFilter.aiStrength}
									onChange={handleAiStrengthChange}
									min={50}
									max={100}
									valueLabelDisplay="auto"
									sx={{pt: 2}}
									marks={[{value: 50, label: '50'}, {value: 100, label: '100'}]}
								/>
							</Stack>
						</Grid>
						<Grid item xs={12} md={12} lg={12}>
							<Typography align="right" sx={{minWidth: 100}}>
								<Link
									component="button"
									variant="body2"
									underline="none"
									onClick={() => {
										setNewFilter(defaultAdvancedFilter);
									}}
								>
									{defaultAdvancedFilter === newFilter ? '' : 'Reset'}
								</Link>
							</Typography>
						</Grid>

					</Grid>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleApply}>Apply</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AdvancedFiltersDialog;
