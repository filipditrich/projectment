import axios, { AxiosInstance, AxiosResponse } from "axios";

// TODO

// Set config defaults when creating the instance
const axiosInstance: AxiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		post: {
			"Content-Type": "application/json",
		},
		put: {
			"Content-Type": "application/json",
		},
		patch: {
			"Content-Type": "application/json",
		},
	},
});

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
	// Do something before request is sent
	// const [{ accessToken }] = useAppContext();
	// config.headers.common["Authorization"] = "Bearer " + accessToken;
	return config;
}, function (error) {
	// Do something with request error
	return Promise.reject(error);
});

// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
	// Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data
	return response;
}, function (error) {
	// Any status codes that falls outside the range of 2xx cause this function to trigger
	// Do something with response error
	return Promise.reject(error);
});

export default function (accessToken?: string): AxiosInstance {
	if (accessToken)
		axiosInstance.defaults.headers.common["Authorization"] = accessToken;
	return axiosInstance;
}

export function statusOk<T = any>(res: AxiosResponse<T>): boolean {
	return (
		res.status === 200 ||
		res.status === 201 ||
		res.statusText === "OK"
	);
}
