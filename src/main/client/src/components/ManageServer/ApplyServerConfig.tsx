import React, {useEffect, useState} from 'react';

import {updateServerConfig, doAuth, updateServer} from './utilities';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

const options = ['Update and Restart', 'Update', 'Start', 'Stop', 'Restart'];

interface IProps {
	serverName: string,
	currentSessionId?: string,
	currentRotationId?: string,
	showNotification: (message:string, severity: any) => void,
	setLoading: (isLoading:boolean) => void,
}

const ApplyServerConfig = (props:IProps) => {
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef<HTMLDivElement>(null);
	const [selectedIndex, setSelectedIndex] = React.useState(1);
	const [formIsValid, setFormIsValid] = React.useState(true);

	const handleAuthClick = () => {
		doAuth();
	};

	const handleUpdateServerConfig = () => {
		props.setLoading(true);

		updateServerConfig({
			serverName: props.serverName,
			activeRaceSessionId: props.currentSessionId ?? '',
			activeRaceRotationId: props.currentRotationId ?? '',
		}).then(res => {
			props.setLoading(false);

			if (res) {
				props.showNotification('Configuration Updated', 'success');
			} else {
				props.showNotification('Error Updating Configuration', 'error');
			}
		});
	};

	const handleUpdateServerConfigAndRestart = () => {
		props.setLoading(true);

		updateServerConfig({
			serverName: props.serverName,
			activeRaceSessionId: props.currentSessionId ?? '',
			activeRaceRotationId: props.currentRotationId ?? '',
		}).then(() => {
			updateServer('restart').then(res => {
				props.setLoading(false);

				if (res) {
					props.showNotification('Configuration Updated and Server Restarted', 'success');
				} else {
					props.showNotification('Error Updating Configuration', 'error');
				}
			});
		});
	};

	const handleRestartServer = () => {
		props.setLoading(true);

		updateServer('restart').then(res => {
			props.setLoading(false);

			if (res) {
				props.showNotification('Server Restarted', 'success');
			} else {
				props.showNotification('Error Restarting Server', 'error');
			}
		});
	};

	const handleStopServer = () => {
		props.setLoading(true);

		updateServer('stop').then(res => {
			props.setLoading(false);

			if (res) {
				props.showNotification('Server Stopped', 'success');
			} else {
				props.showNotification('Error Stopping Server', 'error');
			}
		});
	};

	const handleStartServer = () => {
		props.setLoading(true);

		updateServer('start').then(res => {
			props.setLoading(false);

			if (res) {
				props.showNotification('Server Started', 'success');
			} else {
				props.showNotification('Error Starting Server', 'error');
			}
		});
	};

	const handleClick = () => {
		setFormIsValid(props.serverName !== '');
		if (!formIsValid) {
			return;
		}

		switch (options[selectedIndex]) {
			case 'Update and Restart':
				handleUpdateServerConfigAndRestart();
				break;
			case 'Update':
				handleUpdateServerConfig();
				break;
			case 'Start':
				handleStartServer();
				break;
			case 'Stop':
				handleStopServer();
				break;
			case 'Restart':
				handleRestartServer();
				break;
			default:
				break;
		}
	};

	const handleMenuItemClick = (
		event: React.MouseEvent<HTMLLIElement, MouseEvent>,
		index: number,
	) => {
		setSelectedIndex(index);
		setOpen(false);
	};

	const handleToggle = () => {
		setOpen(prevOpen => !prevOpen);
	};

	const handleClose = (event: Event) => {
		if (
			anchorRef.current
      && anchorRef.current.contains(event.target as HTMLElement)
		) {
			return;
		}

		setOpen(false);
	};

	useEffect(() => {
		setSelectedIndex(0);
	}, []);

	return (
		<React.Fragment>
			<Button onClick={handleAuthClick}>doAuth()</Button>

			<ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
				<Button onClick={handleClick}>{options[selectedIndex]}</Button>
				<Button
					size="small"
					aria-controls={open ? 'split-button-menu' : undefined}
					aria-expanded={open ? 'true' : undefined}
					aria-label="select merge strategy"
					aria-haspopup="menu"
					onClick={handleToggle}
				>
					<ArrowDropDownIcon />
				</Button>
			</ButtonGroup>

			<Popper
				sx={{
					zIndex: 1,
				}}
				open={open}
				anchorEl={anchorRef.current}
				role={undefined}
				transition
				disablePortal
			>
				{({TransitionProps, placement}) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
						}}
					>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList id="split-button-menu" autoFocusItem>
									{options.map((option, index) => (
										<MenuItem
											key={option}
											selected={index === selectedIndex}
											onClick={event => handleMenuItemClick(event, index)}
										>
											{option}
										</MenuItem>
									))}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</React.Fragment>
	);
};

export default ApplyServerConfig;
