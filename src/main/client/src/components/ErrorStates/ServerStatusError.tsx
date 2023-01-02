import React, {useState, useEffect} from 'react';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const ConfigError = () => (
	<Paper sx={{
		p: 2,
		pb: 5,
		display: 'flex',
		flexDirection: 'column',
	}}>
		<Typography variant="h5" align="left" gutterBottom={true}>
				Server Status Error
		</Typography>

		<Typography variant="subtitle1" align="left" gutterBottom={true} maxWidth={500}>
				There was an error loading the server status.
		</Typography>

	</Paper>
);

export default ConfigError;
