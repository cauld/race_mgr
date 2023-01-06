import {createSlice} from '@reduxjs/toolkit';

export interface IServerStatusState {
    isRunning: boolean,
	isLoading: boolean,
	hasError: boolean
  }

const initialState: IServerStatusState = {
	isRunning: true,
	isLoading: true,
	hasError: false,
};

export const serverStatusSlice = createSlice({
	name: 'serverStatus',
	initialState,
	reducers: {
		getServerStatus(state) {
			state.isLoading = true;
		},
		getServerStatusSuccess(state, action) {
			state.isRunning = action.payload.isRunning;
			state.isLoading = false;
		},
		getServerStatusFailure(state) {
			state.hasError = true;
			state.isLoading = false;
		},
		updateServerStatus(state, action) {
			state.isLoading = true;
		},
		updateServerStatusSuccess(state) {
			state.hasError = false;
		},
		updateServerStatusFailure(state) {
			state.hasError = true;
			state.isLoading = false;
		},
	},
});

export const {getServerStatus, getServerStatusSuccess, getServerStatusFailure, updateServerStatus, updateServerStatusSuccess, updateServerStatusFailure} = serverStatusSlice.actions;
export default serverStatusSlice.reducer;
