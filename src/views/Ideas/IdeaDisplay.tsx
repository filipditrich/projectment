import React, { ReactElement } from "react";
// import { useAppContext } from "../../providers";
import { useFetch } from "../../utils";
import { find } from "lodash";
import { loading, error } from "../../misc";

/**
 * Idea IdeaDisplay IdeaDetail Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const IdeaDisplay = (props: { onResponse: (response: any) => void, id: string | undefined }): ReactElement => {
	// const { accessToken } = useAppContext();
	
	const {
		onResponse,
	} = props;
	
	// TODO: de-fake
	const { response, error: err, isLoading } = useFetch(find(JSON.parse(localStorage.getItem("fakeIdeasData") as string), { id: props.id }));
	// const { response, error: err, isLoading } = useFetch(process.env.REACT_APP_API_URL + "/ideas/" + props.id,{
	//     method: "GET",
	//     headers: {
	//         Authorization: "Bearer " + accessToken
	//     }
	// });
	
	if (isLoading) {
		return loading();
	} else if (err !== false) {
		return error(`Došlo k chybě: ${ err.text } (${ err.status })`);
	} else if (response) {
		onResponse(response);
		return (
			<>
				<dl>
					<dt>Název</dt>
					<dd>{ response.name }</dd>
					<dt>Popis</dt>
					<dd>{ response.description }</dd>
					<dt>Id</dt>
					<dd>{ response.id }</dd>
					<dt>Nabízené</dt>
					<dd>{ response.offered ? "Ano" : "Ne" }</dd>
					<dt>Prostředky</dt>
					<dd>{ response.resources }</dd>
					<dt>Předmět</dt>
					<dd>{ response.subject }</dd>
					<dt>Počet řešitelů</dt>
					<dd>{ response.participants }</dd>
				</dl>
			</>
		);
	} else {
		return error("Chybějící data");
	}
};

export default IdeaDisplay;
