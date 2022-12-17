import React from 'react';

import '@fontsource/roboto/400.css';

import AppBar from './components/Nav/AppBar';
import Box from '@mui/material/Box';

function App() {
	return (
		<Box sx={{flexGrow: 1}}>
			<AppBar />
		</Box>
	);
}

export default App;
