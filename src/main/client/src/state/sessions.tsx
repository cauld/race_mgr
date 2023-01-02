import {createSlice} from '@reduxjs/toolkit';
import {ISession} from '../components/ManageServer/interfaces';

export interface ISessionsState {
    isLoading: boolean,
	hasError: boolean,
    sessions: Array<ISession>,
    selectedSessionId: string,
	selectedRotationIds: Array<string>
  }

const initialState: ISessionsState = {
	isLoading: false,
	hasError: false,
	sessions: [],
	selectedSessionId: '',
	selectedRotationIds: [],
};

export const sessionsSlice = createSlice({
	name: 'sessions',
	initialState,
	reducers: {
		getSessions(state) {
			state.isLoading = true;
		},
		getSessionsSuccess(state, action) {
			state.sessions = action.payload;

			state.isLoading = false;
		},
		getSessionsFailure(state) {
			state.hasError = true;
			state.isLoading = false;
		},
		addSession(state, action) {
			state.hasError = false;
			state.isLoading = true;
		},
		addSessionSuccess(state, action) {
			state.selectedSessionId = action.payload; // Select the new session
			state.hasError = false;
			state.isLoading = false;
		},
		addSessionFailure(state) {
			state.selectedSessionId = '';
			state.hasError = true;
			state.isLoading = false;
		},
		setSelectedSessionId(state, action) {
			state.isLoading = true;
		},
		setSelectedSessionIdSuccess(state, action) {
			state.selectedSessionId = action.payload;
			state.isLoading = false;
		},
		updateSession(state, action) {
			// Console.log('***** Brandon ***** update', action.payload);
			state.hasError = false;
			state.isLoading = true;
		},
		updateSessionSuccess(state) {
			// Console.log('***** Brandon ***** update success');
			// State.selectedSessionId = action.payload; // Select the new session
			state.hasError = false;
			state.isLoading = false;
		},
		updateSessionFailure(state) {
			state.selectedSessionId = '';
			state.hasError = true;
			state.isLoading = false;
		},
	},
});

export const {
	getSessions,
	getSessionsSuccess,
	getSessionsFailure,
	addSession,
	addSessionSuccess,
	addSessionFailure,
	setSelectedSessionId,
	setSelectedSessionIdSuccess,
	updateSession,
	updateSessionSuccess,
	updateSessionFailure,
} = sessionsSlice.actions;
export default sessionsSlice.reducer;
