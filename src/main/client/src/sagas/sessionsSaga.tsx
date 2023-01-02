import {call, put, takeEvery} from 'redux-saga/effects';

import {select} from 'redux-saga/effects';
import {fetchSessions, addSession, updateSession, fetchSessionDetail} from '../components/ManageServer/utilities';
import sessions, {
	getSessions,
	getSessionsSuccess,
	getSessionsFailure,
	addSessionSuccess,
	addSessionFailure,
	setSelectedSessionIdSuccess,
	updateSessionSuccess,
	updateSessionFailure,
	sessionsSlice,
} from '../state/sessions';

// Const currentSessions = (state) => state.sessions;
const serverConfig = state => state.serverConfig;

function * workGetSessions() {
	const sessions = yield call(() => fetchSessions());
	const result = yield sessions;

	if (result) {
		yield put(getSessionsSuccess(result));
	} else {
		yield put(getSessionsFailure());
	}
}

function * workAddSession(action) {
	const sessionId = yield call(() => addSession(action.payload));
	const result = yield sessionId;

	if (result) {
		yield put(addSessionSuccess(result));
		yield put(getSessions());
	} else {
		yield put(addSessionFailure());
	}
}

function * workUpdateSession(action) { // Action.payload is the rotation id
	const currentServerConfig = yield select(serverConfig);
	const {name, raceRotationIds} = yield call(() => fetchSessionDetail(currentServerConfig.activeRaceSessionId));

	if (!raceRotationIds.find(r => r === action.payload)) {
		raceRotationIds.push(action.payload);

		const updateSessionResults = yield call(() => updateSession(name, currentServerConfig.activeRaceSessionId, raceRotationIds));
		const result = yield updateSessionResults;

		if (result) { // Status === 200
			yield put(updateSessionSuccess());
		} else {
			yield put(updateSessionFailure());
		}
	} else {
		yield put(updateSessionSuccess());
	}
}

function * workSetSelectedSessionId(action) {
	yield put(setSelectedSessionIdSuccess(action.payload));
}

function * sessionsSaga() {
	yield takeEvery('sessions/getSessions', workGetSessions);
	yield takeEvery('sessions/addSession', workAddSession);
	yield takeEvery('sessions/setSelectedSessionId', workSetSelectedSessionId);
	yield takeEvery('sessions/updateSession', workUpdateSession);
}

export default sessionsSaga;
