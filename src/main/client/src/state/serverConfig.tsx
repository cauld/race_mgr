import {createSlice} from '@reduxjs/toolkit';
import {IRotation, ISession} from '../components/ManageServer/interfaces';

export interface IServerConfigState {
    serverName: string,
	activeRaceSessionId: string,
    activeRaceRotationId: string,
	isLoading: boolean,
	hasError: boolean
  }

const initialState: IServerConfigState = {
	serverName: '',
	activeRaceSessionId: '',
	activeRaceRotationId: '',
	isLoading: true,
	hasError: false,
};

export const serverConfigSlice = createSlice({
	name: 'serverConfig',
	initialState,
	reducers: {
		getServerConfig(state) {
			state.isLoading = true;
		},
		getServerConfigSuccess(state, action) {
			state.serverName = action.payload.serverName ?? state.serverName;
			state.activeRaceSessionId = action.payload.activeRaceSessionId ?? state.activeRaceSessionId;
			state.activeRaceRotationId = action.payload.activeRaceRotationId ?? state.activeRaceRotationId;
			state.isLoading = false;
		},
		getServerConfigFailure(state) {
			state.hasError = true;
			state.isLoading = false;
		},
		updateServerConfig(state, action) {
			state.isLoading = true;
		},
		updateServerConfigSuccess(state, action) {
			state.isLoading = false;
			state.hasError = false;
		},
		updateServerConfigFailure(state) {
			state.isLoading = false;
			state.hasError = true;
		},
	},
});

export const {getServerConfig, getServerConfigSuccess, getServerConfigFailure, updateServerConfig, updateServerConfigSuccess, updateServerConfigFailure} = serverConfigSlice.actions;
export default serverConfigSlice.reducer;
