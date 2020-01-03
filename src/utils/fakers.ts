import mocker from 'mocker-data-generator';
import { useEffect, useState } from 'react';
import { getRandomInt } from './random';

/**
 * Returns a promise with provided <value> after given <delay>.
 * @param {number} delay
 * @param {*} value
 * @returns {Promise<any>}
 */
export function fakePromise(delay: number, value: any = null): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, delay, value));
}

/**
 * User Schema
 */
const userSchema = {
    id: { faker: 'random.uuid' },
    firstName: { faker: 'name.firstName', locale: 'cz' },
    lastName: { faker: 'name.lastName', locale: 'cz' },
    email: { faker: 'internet.email' },
    gender: { function: () => getRandomInt(0, 2) },
    canBeAuthor: { function: () => !(+new Date()%2) ? true : 'false' },
    canBeEvaluator: { function: () => !(+new Date()%2) ? true : 'false' },
};

/**
 * Generates a set of fake data for Table component
 * @param {*} countOptions
 */
export function fakeIdeaData(countOptions: any = 1): any {

    const generated: any[] | any = mocker()
        .schema('data', {
            id: { faker: 'random.uuid' },
            name: { faker: 'commerce.productName' },
            subject: {
                function: (): string => {
                    const subjects: string[] = ["WEB", "PRG", "MME", "MAT", "CJL", "FYZ", "CAD", "3DT"];
                    return subjects[getRandomInt(0, (subjects.length - 1))];
                },
            },
            ideaTargets: {
                function: (): string => {
                    const ideaTargets: string[] = [ "WEB L3", "WEB L4", "PRG P3", "PRG P4", "MME L3", "MME L4" ];
                    return ideaTargets[getRandomInt(0, (ideaTargets.length - 1))];
                },
            },
            offered: { function: () => !(+new Date()%2) ? true : 'false' },
            description: { faker: 'lorem.words' },
            participants: { function: () => getRandomInt(1, 3) },
            resources: { faker: 'commerce.productMaterial' },
        }, countOptions)
        .build((error, data: any) => {
            if (error) throw error;

            // assign random user
            for (const idea of data.data)
                idea['user'] = fakeUsersData[getRandomInt(0, (fakeUsersData.length - 1))];

            return data.data;
        });

    return countOptions === 1 ? generated[0] : generated;
}

/**
 * Generates a Random User
 * @param {*} countOptions
 */
export function fakeUserData(countOptions: any = 1): any {

    const generated = mocker()
        .schema('data', userSchema, countOptions)
        .build((error, data) => {
            if (error) throw error;

            return data;
        });

    return countOptions === 1 ? (generated as any).data[0] : (generated as any).data;
}

/**
 * Fake Data Fetcher
 * @param {*} fetchedData
 * @param {boolean=true} success
 */
export const useFetch = (fetchedData: any, success: boolean = true): any => {
    const [ response, setResponse ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(false);

            let res, json;
            try {
                res = await fakePromise(getRandomInt(500, 1000), success
                    ? { ok: true, status: 200, statusText: "200 OK", json: () => fetchedData }
                    : { ok: false, status: 500, statusText: "500 Internal Server Error", json: () => fetchedData });

                if (res.ok) {
                    json = await res.json();
                    setResponse(json);
                } else throw new Error(res.statusText);
            } catch (error) {
                // setError({ status: res.status, text: error.message });
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })();
    },[]);

    return { response, error, isLoading };
};

// TODO: delete
// export const fakeUsersData: any[] = fakeUserData({ max: 50, min: 1 });
// export const fakeIdeasData: any[] = fakeIdeaData({ max: 100, min: 20 });
// export const fakeSignedInUserData: any = fakeUsersData[getRandomInt(0, (fakeUsersData.length - 1))];

export const fakeUsersData: any[] = JSON.parse(localStorage.getItem('fakeUsersData') as string);
export const fakeIdeasData: any[] = JSON.parse(localStorage.getItem('fakeIdeasData') as string);
export const fakeSignedInUserData: any = fakeUsersData[getRandomInt(0, (fakeUsersData.length - 1))];
