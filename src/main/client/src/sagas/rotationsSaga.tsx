import {call, put, takeEvery} from 'redux-saga/effects';
import {fetchRotations, addRotation, activateRotationId} from '../components/ManageServer/utilities';
import {
	getRotations,
	getRotationsSuccess,
	getRotationsFailure,
	addRotationSuccess,
	addRotationFailure,
	setSelectedRotationIdSuccess,
	activateRotationIdSuccess,
	activateRotationIdFailure,
} from '../state/rotations';

import {getServerStatus} from '../state/serverStatus';
import {updateSession} from '../state/sessions';

function * workGetRotations() {
	const rotations = yield call(() => fetchRotations());
	const result = yield rotations;

	if (result) {
		yield put(getRotationsSuccess(result));
	} else {
		yield put(getRotationsFailure());
	}
}

function * workAddRotation(action) {
	const rotationId = yield call(() => addRotation(action.payload));
	const result = yield rotationId;

	if (result) {
		yield put(addRotationSuccess(result));
		yield put(getRotations());
	} else {
		yield put(addRotationFailure());
	}
}

function * workSetSelectedRotationId(action) {
	yield put(setSelectedRotationIdSuccess(action.payload));
}

function * workActivateRotationId(action) {
	const addRotationresult = yield call(() => activateRotationId(action.payload));
	const result = yield addRotationresult;
	if (result.status === 200) {
		yield put(activateRotationIdSuccess());
		yield put(updateSession(action.payload)); // Add the RotationId to the Active Session
		yield put(getServerStatus());
	} else {
		yield put(activateRotationIdFailure());
	}
}

function * rotationsSaga() {
	yield takeEvery('rotations/getRotations', workGetRotations);
	yield takeEvery('rotations/addRotation', workAddRotation);
	yield takeEvery('rotations/setSelectedRotationId', workSetSelectedRotationId);
	yield takeEvery('rotations/activateRotationId', workActivateRotationId);
}

export default rotationsSaga;
