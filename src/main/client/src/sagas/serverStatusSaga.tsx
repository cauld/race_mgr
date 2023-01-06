import {call, put, takeEvery} from 'redux-saga/effects';
import {fetchServerStatus, updateServer} from '../components/ManageServer/utilities';
import {getServerStatusSuccess, getServerStatusFailure, getServerStatus, updateServerStatusSuccess, updateServerStatusFailure} from '../state/serverStatus';

// eslint-disable-next-line no-promise-executor-return
const delay = time => new Promise(resolve => setTimeout(resolve, time));

function * workGetServerStatus() {
	const serverStatus = yield call(() => fetchServerStatus());
	const result = yield serverStatus;

	if (result) {
		yield put(getServerStatusSuccess(result));
	} else {
		yield put(getServerStatusFailure());
	}
}

function * workUpdateServerStatus(action) {
	const serverStatus = yield call(() => updateServer(action.payload));
	const result = yield serverStatus;

	if (result) {
		yield put(updateServerStatusSuccess());
	} else {
		yield put(updateServerStatusFailure());
	}
}

function * workUpdateServerStatusSuccess(action) {
	yield call(delay, 1000); // Give the server status a chance to update
	yield put(getServerStatus());
}

function * serverStatusSaga() {
	yield takeEvery('serverStatus/getServerStatus', workGetServerStatus);
	yield takeEvery('serverStatus/updateServerStatus', workUpdateServerStatus);
	yield takeEvery('serverStatus/updateServerStatusSuccess', workUpdateServerStatusSuccess);
}

export default serverStatusSaga;
