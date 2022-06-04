import * as React from 'react';
import {useState} from 'react';

import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import {makeStyles} from '@material-ui/core/styles';

import LeaderBoard from '../Leaderboard/LeaderBoard';
import ManageServer from '../ManageServer/ManageServer';
import StatsPage from '../Stats/Stats';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import SignalCellular4BarIcon from '@mui/icons-material/SignalCellular4Bar';
import Footer from './Footer';

import {
	BrowserRouter as Router,
	Switch, Route, Link as RouterLink,
} from 'react-router-dom';

import BarChartIcon from '@mui/icons-material/BarChart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: prop => prop !== 'open'})(
	({theme, open}) => ({
		'& .MuiDrawer-paper': {
			position: 'relative',
			whiteSpace: 'nowrap',
			width: drawerWidth,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
			boxSizing: 'border-box',
			...(!open && {
				overflowX: 'hidden',
				transition: theme.transitions.create('width', {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.leavingScreen,
				}),
				width: theme.spacing(7),
				[theme.breakpoints.up('sm')]: {
					width: theme.spacing(9),
				},
			}),
		},
	}),
);

const mdTheme = createTheme();

const DashboardContent = () => {
	const [open, setOpen] = React.useState(true);
	const [serverStatus, setServerStatus] = useState(0);

	// Set the defaults
	const toggleDrawer = () => {
		setOpen(!open);
	};

	const useStyles = makeStyles(theme => ({
		drawerPaper: {width: 'inherit'},
		link: {
			textDecoration: 'none',
			color: theme.palette.text.primary,
		},
		list: {
			width: '300px',
		},
	}));

	const classes = useStyles();

	return (
		<ThemeProvider theme={mdTheme}>
			<Router>
				<Box sx={{display: 'flex'}}>
					<CssBaseline />
					<AppBar position="absolute" open={open}>
						<Toolbar
							sx={{
								pr: '24px', // Keep right padding when drawer closed
							}}
						>
							<IconButton
								edge="start"
								color="inherit"
								aria-label="open drawer"
								onClick={toggleDrawer}
								sx={{
									marginRight: '36px',
									...(open && {display: 'none'}),
								}}
							>
								<MenuIcon />
							</IconButton>
							<Typography
								component="h1"
								variant="h6"
								color="inherit"
								noWrap
								sx={{flexGrow: 1}}
							>
              Race Manager
							</Typography>
							<IconButton color="inherit">
								<Tooltip title="Server is Running">
									<SignalCellular4BarIcon/>
								</Tooltip>
							</IconButton>
						</Toolbar>
					</AppBar>

					<Drawer variant="permanent" open={open}>
						<Toolbar
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-end',
								px: [1],
							}}
						>
							<IconButton onClick={toggleDrawer}>
								<ChevronLeftIcon />
							</IconButton>
						</Toolbar>
						<Divider />
						<List component="nav">
							<RouterLink to="/" className={classes.link}>
								<ListItemButton>
									<ListItemIcon>
										<BarChartIcon />
									</ListItemIcon>
									<ListItemText primary="Leader Board" />
								</ListItemButton>
							</RouterLink>

							<RouterLink to="/manageserver" className={classes.link}>
								<ListItemButton>
									<ListItemIcon>
										<PermDataSettingIcon />
									</ListItemIcon>
									<ListItemText primary="Mange Server" />
								</ListItemButton>
							</RouterLink>

							<RouterLink to="/stats" className={classes.link}>
								<ListItemButton>
									<ListItemIcon>
										<QueryStatsIcon />
									</ListItemIcon>
									<ListItemText primary="Stats" />
								</ListItemButton>
							</RouterLink>

						</List>
					</Drawer>

					<Box
						component="main"
						sx={{
							backgroundColor: theme =>
								theme.palette.mode === 'light'
									? theme.palette.grey[100]
									: theme.palette.grey[900],
							flexGrow: 1,
							height: '100vh',
							overflow: 'auto',
						}}
					>
						<Toolbar />
						<Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
							<Switch>
								<Route exact path="/">
									<LeaderBoard />
								</Route>
								<Route exact path="/manageServer">
									<ManageServer />
								</Route>
								<Route exact path="/stats">
									<StatsPage />
								</Route>
							</Switch>
							<Footer />
						</Container>
					</Box>
				</Box>
			</Router>

		</ThemeProvider>
	);
};

export default function Dashboard() {
	return <DashboardContent />;
}