import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {updateServerStatus} from '../../state/serverStatus';
import {updateServerConfig} from '../../state/serverConfig';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

const options = ['Update Server', 'Start Server', 'Stop Server'];

interface IProps {
	showNotification: (message:string, severity: any) => void,
	setIsServerRunning: (isRunning:boolean) => void
}

const ApplyServerConfig = (props:IProps) => {
	const anchorRef = React.useRef<HTMLDivElement>(null);

	const [open, setOpen] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(1); // SplitButton
	const [formIsValid, setFormIsValid] = React.useState(true);

	const {serverStatus, serverConfig, sessions, rotations} = useSelector((state:any) => state);

	const dispatch = useDispatch();

	useEffect(() => {
		const formIsValid
			= sessions.selectedSessionId !== ''
			&& sessions.selectedSessionId !== undefined
			&& rotations.selectedRotationId !== ''
			&& rotations.selectedRotationId !== undefined;
		setFormIsValid(formIsValid);
	}, [sessions.selectedSessionId, rotations.selectedRotationId]);

	const handleUpdateServerConfig = () => {
		dispatch(updateServerConfig(
			{
				activeRaceSessionId: sessions.selectedSessionId ?? '',
				activeRaceRotationId: rotations.selectedRotationId ?? '',
			}),
		);
	};

	const handleStopServer = () => {
		if (serverStatus.isRunning) {
			dispatch(updateServerStatus('stop'));
		}
	};

	const handleStartServer = () => {
		if (!serverStatus.isRunning) {
			dispatch(updateServerStatus('start'));
		}
	};

	const handleClick = () => {
		switch (options[selectedIndex]) {
			case 'Update Server':
				handleUpdateServerConfig();
				break;
			case 'Start Server':
				handleStartServer();
				break;
			case 'Stop Server':
				handleStopServer();
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
			<ButtonGroup disabled={!formIsValid} variant="contained" ref={anchorRef} aria-label="split button">
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
