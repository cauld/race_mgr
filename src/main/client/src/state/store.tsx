import {configureStore} from '@reduxjs/toolkit';

import serverConfigReducer from './serverConfig';
import serverStatusReducer from './serverStatus';
import sessionsReducer from './sessions';

export default configureStore(
	{
		reducer: {
			serverConfig: serverConfigReducer,
			serverStatus: serverStatusReducer,
			sessions: sessionsReducer,
		},
	},
);
