import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import createSagaMiddleWare from 'redux-saga';
import {configureStore} from '@reduxjs/toolkit';
import rootSaga from './sagas/rootSaga';

import serverConfigReducer from './state/serverConfig';
import serverStatusReducer from './state/serverStatus';
import sessionsReducer from './state/sessions';
import rotationsReducer from './state/rotations';
import rotationDetailReducer from './state/rotationDetail';

const saga = createSagaMiddleWare();

const store = configureStore({
	reducer: {
		serverConfig: serverConfigReducer,
		serverStatus: serverStatusReducer,
		sessions: sessionsReducer,
		rotations: rotationsReducer,
		rotationDetail: rotationDetailReducer,
	},
	middleware: [saga],
});

saga.run(rootSaga);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root'),
);
