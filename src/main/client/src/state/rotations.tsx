import {createSlice} from '@reduxjs/toolkit';
import {IRotation} from '../components/ManageServer/interfaces';

export interface IRotationsState {
    isLoading: boolean,
	hasError: boolean,
    rotations: Array<IRotation>,
    selectedRotationId: string
  }

const initialState: IRotationsState = {
	isLoading: false,
	hasError: false,
	rotations: [],
	selectedRotationId: '',
};

export const rotationsSlice = createSlice({
	name: 'rotations',
	initialState,
	reducers: {
		getRotations(state) {
			state.isLoading = true;
		},
		getRotationsSuccess(state, action) {
			state.rotations = action.payload;

			state.isLoading = false;
		},
		getRotationsFailure(state) {
			state.hasError = true;
			state.isLoading = false;
		},
		addRotation(state, action) {
			state.hasError = false;
			state.isLoading = true;
		},
		addRotationSuccess(state, action) {
			state.selectedRotationId = action.payload; // Select the new rotation
			state.hasError = false;
			state.isLoading = false;
		},
		addRotationFailure(state) {
			state.selectedRotationId = '';
			state.hasError = true;
			state.isLoading = false;
		},
		setSelectedRotationId(state, action) {
			state.isLoading = true;
		},
		setSelectedRotationIdSuccess(state, action) {
			state.selectedRotationId = action.payload;
			state.isLoading = false;
		},
		activateRotationId(state, action) {
			state.isLoading = true;
		},
		activateRotationIdSuccess(state) {
			state.isLoading = false;
		},
		activateRotationIdFailure(state) {
			state.isLoading = false;
		},
	},
});

export const {
	getRotations,
	getRotationsSuccess,
	getRotationsFailure,
	addRotation,
	addRotationSuccess,
	addRotationFailure,
	setSelectedRotationId,
	setSelectedRotationIdSuccess,
	activateRotationId,
	activateRotationIdSuccess,
	activateRotationIdFailure,

} = rotationsSlice.actions;
export default rotationsSlice.reducer;
