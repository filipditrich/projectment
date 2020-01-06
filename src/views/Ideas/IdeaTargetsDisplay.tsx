import React, { ReactElement, useEffect, useState } from "react";
import { useAppContext } from "../../providers";
import { fakePromise, getRandomInt } from "../../utils";
import { loading, error as errorFallback } from "../../misc";

/**
 * Idea Display Targets
 * @param props
 * @returns {any}
 * @constructor
 */
export const IdeaDisplayTargets = (props: any): ReactElement => {
	
	const { accessToken } = useAppContext();
	const [ isLoadingAll, setIsLoadingAll ]: any = useState(false);
	const [ errorAll, setErrorAll ]: any = useState(false);
	const [ dataAll, setDataAll ]: any = useState(null);
	const [ isLoading, setIsLoading ]: any = useState(false);
	const [ error, setError ]: any = useState(false);
	const [ data, setData ]: any = useState(null);
	
	useEffect(() => {
		(async () => {
			setIsLoading(true);
			setError(false);
			setIsLoadingAll(true);
			setErrorAll(false);
			
			let res, json;
			try {
				// TODO: de-fake
				res = await fakePromise(getRandomInt(500, 1000), {
					ok: true,
					json: () => {
						return {
							data: [
								{ text: "T1" },
								{ text: "T2" },
								{ text: "T3" },
							],
						};
					},
				});
				// res = await fetch(process.env.REACT_APP_API_URL + "/targets", {
				//     method: "GET",
				//     headers: { Authorization: "Bearer " + accessToken }
				// });
				if (res.ok) {
					json = await res.json();
					setDataAll(json);
				} else {
					throw new Error(res.statusText);
				}
			} catch (error) {
				setErrorAll({ status: res.status, text: error.message });
			} finally {
				setIsLoadingAll(false);
			}
			
			try {
				// TODO: de-fake
				res = await fakePromise(getRandomInt(100, 500), {
					ok: true,
					json: () => [ { text: "T1" } ],
				});
				// res = await fetch(process.env.REACT_APP_API_URL + "/ideas/" + props.id + "/targets", {
				//     method: "GET",
				//     headers: { Authorization: "Bearer " + accessToken }
				// });
				if (res.ok) {
					json = await res.json();
					setData(json);
				} else {
					throw new Error(res.statusText);
				}
			} catch (error) {
				setError({ status: res.status, text: error.message });
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);
	
	if (error || errorAll) {
		return errorFallback("Došlo k chybě.");
	}
	if (isLoading || isLoadingAll) {
		return loading();
	}
	if (data && dataAll) {
		// console.log(data, dataAll);
		return (
			<>
				<h3>Všechny cílové skupiny</h3>
				<ul>
					{ dataAll.data.map((t: any, i: number) => {
						return <li key={ i }>{ t.text }</li>;
					}) }
				</ul>
				<h3>Použité cílové skupiny</h3>
				<ul>
					{ data.map((t: any, i: number) => {
						return <li key={ i }>{ t.text }</li>;
					}) }
				</ul>
			</>
		);
	} else return loading("Zpracovávám data");
};

export default IdeaDisplayTargets;
