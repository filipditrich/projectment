import React, { ReactElement } from "react";
import { Genders } from '../../models';
import { useAppContext } from "../../providers";
import { useFetch } from "../../utils";
import { find } from "lodash";
import { loading, error } from "../../misc";

/**
 * Idea IdeaDetail User IdeaDisplay Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const IdeaUserDisplay = (props: any): ReactElement => {
	const { accessToken } = useAppContext();
	
	const {
		userData,
	} = props;
	
	// TODO: de-fake
	const { response, error: err, isLoading } = useFetch(find(JSON.parse(localStorage.getItem("fakeUsersData") as string), { id: userData.id }));
	// const { response, error: err, isLoading } = useFetch(process.env.REACT_APP_API_URL + "/users/" + props.id,{
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
		return (
			<dl>
				<dt>Jméno a příjmení</dt>
				<dd>{ response.firstName + " " + response.lastName }</dd>
				<dt>Email</dt>
				<dd>{ response.email }</dd>
				<dt>Id</dt>
				<dd>{ response.id }</dd>
				<dt>Pohlaví</dt>
				<dd>{ (response.gender === Genders.Male) ? "Muž" : (response.gender === Genders.Female) ? "Žena" : "Jiné nebo neznámé" }</dd>
				<dt>Autor prací</dt>
				<dd>{ response.canBeAuthor ? "Ano" : "Ne" }</dd>
				<dt>Hodnotitel prací</dt>
				<dd>{ response.canBeEvaluator ? "Ano" : "Ne" }</dd>
			</dl>
		);
	} else {
		return error("Chybějící data");
	}
};

export default IdeaUserDisplay;
