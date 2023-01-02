import {call, put, takeEvery} from 'redux-saga/effects';
import {fetchRotationDetail} from '../components/ManageServer/utilities';
import {
	getRotationDetailSuccess,
	getRotationDetailFailure,

} from '../state/rotationDetail';

function * workGetRotationDetail(action) {
	const rotationDetail = yield call(() => fetchRotationDetail(action.payload));
	const result = yield rotationDetail;

	if (result) {
		yield put(getRotationDetailSuccess(result));
	} else {
		yield put(getRotationDetailFailure());
	}
}

function * rotationDetailSaga() {
	yield takeEvery('rotationDetail/getRotationDetail', workGetRotationDetail);
}

export default rotationDetailSaga;
