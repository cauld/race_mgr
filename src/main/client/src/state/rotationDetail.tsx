import {createSlice} from '@reduxjs/toolkit';
import {IRotationDetail} from '../components/ManageServer/interfaces';

export interface IRotationDetailState {
    isLoading: boolean,
	hasError: boolean,
    rotationDetail?: IRotationDetail
  }

const initialState: IRotationDetailState = {
	isLoading: false,
	hasError: false,
	rotationDetail: undefined,
};

export const rotationDetailSlice = createSlice({
	name: 'rotationDetail',
	initialState,
	reducers: {
		getRotationDetail(state, action) {
			state.isLoading = true;
		},
		getRotationDetailSuccess(state, action) {
			state.rotationDetail = action.payload;
			state.isLoading = false;
		},
		getRotationDetailFailure(state) {
			state.hasError = true;
			state.isLoading = false;
		},
	},
});

export const {getRotationDetail, getRotationDetailSuccess, getRotationDetailFailure} = rotationDetailSlice.actions;
export default rotationDetailSlice.reducer;
