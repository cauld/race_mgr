import React, {useState, useEffect} from 'react';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const ServerConfigError = () => (
	<Paper sx={{
		p: 2,
		pb: 5,
		display: 'flex',
		flexDirection: 'column',
	}}>
		<Typography variant="h5" align="left" gutterBottom={true}>
				Error Loading Config
		</Typography>

		<Typography variant="subtitle1" align="left" gutterBottom={true} maxWidth={500}>
				There was an error loading the server configuration.  Make sure race manager is running and the server is configured.
		</Typography>

	</Paper>
);

export default ServerConfigError;
