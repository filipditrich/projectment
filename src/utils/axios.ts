import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { oc } from "ts-optchain";
import { DataJsonResponse, TableDataJsonResponse } from "../models/response";

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

/**
 * Returns an axios instance with Authorization token set (if signed in)
 * @param accessToken
 */
export default function (accessToken?: string): AxiosInstance {
	if (accessToken)
		axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
	return axiosInstance;
}

/**
 * Returns whether the response returned an OK response
 * @param res
 */
export function isStatusOk<T = any>(res: AxiosResponse<T>): boolean {
	return (
		(res.status >= 200 && res.status <= 208) ||
		res.status === 226 ||
		res.statusText === "OK"
	);
}

/**
 * Returns an error from the given response that failed (was not of status OK)
 * @param res
 * @param fallbackMessage
 */
export function responseFail<T = any>(res: AxiosResponse<T>, fallbackMessage?: string): Error {
	return new Error(`${res.data instanceof String ? res.data : fallbackMessage || `${ res.statusText || res.status }`}`);
}

/**
 * Returns a formatted error from the caught error
 * @param error
 * @param fallbackMessage
 */
export function responseError(error: Partial<AxiosError & Error>, fallbackMessage?: string): Error {
	if (!!error.isAxiosError && !error.response) console.error("[axios] network error");
	return new Error(error.isAxiosError ? JSON.stringify(oc(error).response.data.errors(oc(error).response.data(fallbackMessage || error.message))) as any : error);
}

/**
 * Handle responses and return their data
 * @param responses
 */
export function handleRes<T = TableDataJsonResponse | DataJsonResponse>(...responses: AxiosResponse<T>[]): AxiosResponse<T>[] {
	for (const response of responses)
		if (!isStatusOk(response)) throw responseFail(response);
	return responses;
}
