import React, {useState, useEffect} from 'react';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const ServerStopped = () => (
	<Paper sx={{
		p: 2,
		pb: 5,
		display: 'flex',
		flexDirection: 'column',
	}}>
		<Typography variant="h5" align="left" gutterBottom={true}>
				Server is Stopped
		</Typography>

		<Typography variant="subtitle1" align="left" gutterBottom={true} maxWidth={500}>
				The game server is not running.
		</Typography>

	</Paper>
);

export default ServerStopped;
