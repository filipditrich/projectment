import pad from "./padder";
import { enumToArray } from "./helpers";
import { useQuery } from "./query";
import { getRandomInt, randomBoolean } from "./random";
import { fakePromise } from "./fakers";
import { name, greeter } from "./name";
// import { importLogo } from "./logo";
import Axios, { isStatusOk } from "./axios";

export {
	pad,
	useQuery,
	getRandomInt,
	name,
	greeter,
	randomBoolean,
	enumToArray,
	Axios,
	isStatusOk,
	// importLogo,
	
	// fakers
	fakePromise,
};
