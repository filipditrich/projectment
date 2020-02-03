import { useState, useEffect } from "react";

export const useFetch = (url: string, options: any) => {
	const [ response, setResponse ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState({});
	
	useEffect(() => {
		(async () => {
			setIsLoading(true);
			setError(false);
			let res: Response;
			let json: any;
			try {
				res = await fetch(url, options);
				if (res.ok) {
					json = await res.json();
					setResponse(json);
				} else {
					throw new Error(res.statusText);
				}
			} catch (error) {
				setError({ status: error.status, text: error.message });
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ url ]);
	return { response, error, isLoading };
};
