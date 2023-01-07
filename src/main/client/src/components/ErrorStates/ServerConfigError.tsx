import React, {useState, useEffect} from 'react';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {Link as RouterLink} from 'react-router-dom';

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
				There was an error loading the server configuration. It is possible that an active race session and/or rotation is not set (e.g. during initial setup). Use the Race Manager <RouterLink to="/manageserver">admin UI</RouterLink> to create/update these before racing.
		</Typography>

	</Paper>
);

export default ServerConfigError;
