import pad from './padder';
// import { useFetch } from './fetch'; // TODO: re-enable
import { useQuery } from './query';
import { getRandomInt } from './random';
import {
    fakePromise,
    fakeIdeaData,
    fakeIdeasData,
    fakeSignedInUserData,
    fakeUsersData,
    fakeUserData,
    useFetch,
} from './fakers'; // TODO: remove fake useFetch()

export {
    pad,
    useFetch,
    useQuery,
    getRandomInt,
    fakePromise,
    fakeIdeaData,
    fakeIdeasData,
    fakeUsersData,
    fakeUserData,
    fakeSignedInUserData,
};
