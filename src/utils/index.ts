import pad from "./padder";
// import { useFetch } from './fetch'; // TODO: re-enable
import { useQuery } from "./query";
import { getRandomInt, randomBoolean } from "./random";
import {
	fakePromise,
	fakeIdeaData,
	fakeIdeasData,
	fakeSignedInUserData,
	fakeUsersData,
	fakeUserData,
	useFetch,
} from "./fakers"; // TODO: remove fake useFetch()

export {
	pad,
	useFetch,
	useQuery,
	getRandomInt,
	randomBoolean,
	fakePromise,
	fakeIdeaData,
	fakeIdeasData,
	fakeUsersData,
	fakeUserData,
	fakeSignedInUserData,
};
