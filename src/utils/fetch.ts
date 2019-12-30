import { useState, useEffect } from 'react';

export const useFetch = (url: string, options: any) => {
    const [ response, setResponse ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(false);
            let res;
            let json;
            try {
                res = await fetch(url, options);
                if (res.ok) {
                    json = await res.json();
                    console.log(json);
                    setResponse(json);
                }
                else {
                    throw new Error(res.statusText);
                }
            } catch (error) {
                // setError({ status: res.status, text: error.message });
            } finally {
                setIsLoading(false);
            }
        })();
    },[ url ]);
    return { response, error, isLoading };
};
