import {all, fork} from 'redux-saga/effects';
import serverConfigSaga from './serverConfigSaga';
import serverStatusSaga from './serverStatusSaga';
import sessionsSaga from './sessionsSaga';
import rotationsSaga from './rotationsSaga';
import rotationDetailSaga from './rotationDetailSaga';

function * rootSaga() {
	yield all([
		fork(serverConfigSaga),
		fork(serverStatusSaga),
		fork(sessionsSaga),
		fork(rotationsSaga),
		fork(rotationDetailSaga),
	]);
}

export default rootSaga;
