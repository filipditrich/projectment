import React, { ReactElement, useEffect, useState } from "react";
import { RequestMethod } from "../../models";
import { useAppContext } from "../../providers";
import { loading, error as errorFallback } from "../../misc";

/**
 * Idea Display Targets
 * @param props
 * @returns {any}
 * @constructor
 */
export const IdeaDisplayTargets = (props: any): ReactElement => {
	
	const [ { accessToken } ] = useAppContext();
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
				res = await fetch(process.env.REACT_APP_API_URL + "/targets", {
					method: RequestMethod.GET,
					headers: { Authorization: "Bearer " + accessToken },
				});
				if (res.ok) {
					json = await res.json();
					setDataAll(json);
				} else {
					throw new Error(res.statusText);
				}
			} catch (error) {
				setErrorAll({ status: error.status, text: error.message });
			} finally {
				setIsLoadingAll(false);
			}
			
			try {
				res = await fetch(process.env.REACT_APP_API_URL + "/ideas/" + props.id + "/targets", {
					method: RequestMethod.GET,
					headers: { Authorization: "Bearer " + accessToken },
				});
				
				if (res.ok) {
					json = await res.json();
					setData(json);
				} else {
					throw new Error(res.statusText);
				}
			} catch (error) {
				setError({ status: error.status, text: error.message });
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
