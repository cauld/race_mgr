import {call, put, takeEvery} from 'redux-saga/effects';
import {fetchServerStatus, updateServer} from '../components/ManageServer/utilities';
import {getServerStatusSuccess, getServerStatusFailure, getServerStatus, updateServerStatusFailure} from '../state/serverStatus';

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
		yield put(getServerStatus());
	} else {
		yield put(updateServerStatusFailure());
	}
}

function * serverStatusSaga() {
	yield takeEvery('serverStatus/getServerStatus', workGetServerStatus);
	yield takeEvery('serverStatus/updateServerStatus', workUpdateServerStatus);
}

export default serverStatusSaga;
