import RaceMgrApi from '../../api/RaceMgrApi';

export const doAuth = async (userName: string, password: string) => {
	const rmApi = new RaceMgrApi();

	try {
		return rmApi.doAuth(userName, password);
	} catch (err) {
		console.log('Error', err);
	}
};

