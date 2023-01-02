import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

export default class RaceMgrApi {
	private readonly BASE_API_URL = '/api';
	private readonly BASE_API_URL_WITH_VERSION = `${this.BASE_API_URL}/v1`;
	private readonly BASE_ADMIN_URL = `${this.BASE_API_URL_WITH_VERSION}/admin`;

	private checkIfXsrfTokenIsRequired(config: AxiosRequestConfig): boolean {
		let xsrfTokenRequired = false;
		const methodsOfInterest = ['post', 'put', 'patch', 'delete'];
		if (config.method) {
			const method = config.method.toLocaleLowerCase();
			if (methodsOfInterest.indexOf(method) > -1) {
				xsrfTokenRequired = true;
			}
		} else {
			throw new Error('Request method unknown!');
		}

		return xsrfTokenRequired;
	}

	// Called before any API endpoint that requires manipulation (i.e.) POST/PUT/PATCH/DELETE
	private async setXsrfTokenIfNeeded(config: AxiosRequestConfig): Promise<any> {
		const xsrfTokenIsRequired = this.checkIfXsrfTokenIsRequired(config);
		if (xsrfTokenIsRequired) {
			// Just hit the unauthenticated root to get a generated XSRF-TOKEN

			const tokenRequestConfig = {
				method: 'get',
				url: this.BASE_API_URL,
			};

			// Response.headers['Set-Cookie'] will have the XSRF-TOKEN cookie
			// This gets called by the browser automatically so the next request will
			// already have the XSRF-TOKEN set now, nothing else needed.

			await axios(tokenRequestConfig);
		}

		return Promise.resolve();
	}

	// Will automatically add the JWT to any admin api request
	// doAuth is required somewhere in the flow to get the token set first
	private setAuthTokenIfNeeded(config: AxiosRequestConfig = {}) {
		const jwtToken = this.getCookie('JWT-TOKEN');
		if (config.url && config.url.includes('/admin')) {
			if (jwtToken !== null) {
				axios.defaults.headers.common.Authorization = `Bearer ${jwtToken}`;
			} else {
				throw new Error('Admin endpoint requested, but no token found. Call doAuth first.');
			}
		} else {
			axios.defaults.headers.common.Authorization = null;
		}
	}

	public getBaseApiUrl() {
		return this.BASE_API_URL_WITH_VERSION;
	}

	public getBaseAdminApiUrl() {
		return this.BASE_ADMIN_URL;
	}

	// Public endpoints need no auth, else I would have made these inputs
	// request to init the class. So just call once before making any admin
	// requests and it will keep the token in memory for subsequent requests.
	public async doAuth(username: string, password: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			const data = JSON.stringify({
				username,
				password,
			});

			const config: AxiosRequestConfig = {
				method: 'post',
				url: `${this.BASE_API_URL_WITH_VERSION}/authenticate`,
				headers: {
					'Content-Type': 'application/json',
				},
				data,
			};

			await this.setXsrfTokenIfNeeded(config);

			try	{
				const response = await axios(config);
				if (response.status === 200) {
					document.cookie = 'JWT-TOKEN=' + response.data.data.token + ';expires=Fri, 31 Dec 9999 23:59:59 GMT';
					resolve('OK');
				} else {
					resolve('Error');
				}
			} catch {
				resolve('Error');
			}
		});
	}

	// This is the general method you'd call most often. In the config
	// obj it expects url and method at least. It will automatically set
	// xsrf tokens as needed and also add the JWT as needed (assuming doAuth
	// was previously called).
	public async makeApiCall(config: AxiosRequestConfig): Promise<any> {
		return this.setXsrfTokenIfNeeded(config).then(() => {
			this.setAuthTokenIfNeeded(config);
			return axios(config);
		});
	}

	private getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) {
			const val = parts.pop();
			if (val) {
				return val.split(';').shift();
			}
		}

		return '';
	}
}
