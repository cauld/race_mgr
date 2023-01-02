import {call, put, takeEvery} from 'redux-saga/effects';
import {fetchServerConfig, updateServerConfig} from '../components/ManageServer/utilities';
import {activateRotationId} from '../state/rotations';
import {getServerConfig, getServerConfigSuccess, getServerConfigFailure, updateServerConfigSuccess, updateServerConfigFailure} from '../state/serverConfig';

function * workGetServerConfig() {
	const serverConfig = yield call(() => fetchServerConfig());
	const result = yield serverConfig;

	if (result) {
		yield put(getServerConfigSuccess(result));
	} else {
		yield put(getServerConfigFailure());
	}
}

function * workUpdateServerConfig(action) {
	const serverConfig = yield call(() => updateServerConfig(action.payload));
	const result = yield serverConfig;

	if (result.status === 200) {
		// Update Config
		yield put(updateServerConfigSuccess(result));

		// Refresh Config
		yield put(getServerConfig());

		// Active the Rotation
		yield put(activateRotationId(action.payload.activeRaceRotationId));
	} else {
		yield put(updateServerConfigFailure());
	}
}

function * serverConfigSaga() {
	yield takeEvery('serverConfig/getServerConfig', workGetServerConfig);
	yield takeEvery('serverConfig/updateServerConfig', workUpdateServerConfig);
}

export default serverConfigSaga;
