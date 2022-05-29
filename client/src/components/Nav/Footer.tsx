import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Copyright = (props: any) => (
	<Typography variant="body2" color="text.secondary" align="center" {...props}>
		{'Copyright © '}
		<Link color="inherit" href="https://github.com/cauld/race_mgr/">
        Race Manager
		</Link>{' '}
		{new Date().getFullYear()}
		{'.'}
	</Typography>
);

const Footer:React.FC = () => <Copyright sx={{pt: 4}} />;

export default Footer;
