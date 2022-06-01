import React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const StatsPage:React.FC = () => (
	<Grid container spacing={3}>
		<Grid item xs={12}>
			<Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
				Stats Page
			</Paper>
		</Grid>
	</Grid>
);

export default StatsPage;
