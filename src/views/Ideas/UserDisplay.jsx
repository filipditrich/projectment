import React from "react";
import { useAppContext } from "../../providers";
import { useFetch } from "../../utils";
import { find } from "lodash";

/**
 * Idea Detail User Display Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const UserDisplay = (props) => {
    const { accessToken } = useAppContext();

    // TODO: de-fake
    const { response, error, isLoading } = useFetch(find(JSON.parse(localStorage.getItem("fakeUsersData")), { id: props.id }));
    // const { response, error, isLoading } = useFetch(process.env.REACT_APP_API_URL + "/users/" + props.id,{
    //     method: "GET",
    //     headers: {
    //         Authorization: "Bearer " + accessToken
    //     }
    // });

    if (isLoading) {
        return <p>Nahrávání dat</p>;
    } else if (error !== false) {
        return <div>{"Došlo k chybě: " + error.text + " (" + error.status + ")"}</div>;
    } else if (response) {
        return (
            <dl>
                <dt>Jméno a příjmení</dt>
                <dd>{response.firstName + " " + response.lastName}</dd>
                <dt>Email</dt>
                <dd>{response.email}</dd>
                <dt>Id</dt>
                <dd>{response.id}</dd>
                <dt>Pohlaví</dt>
                <dd>{(response.gender === 0)  ? "Muž" : (response.gender === 1) ? "Žena" : "Jiné nebo neznámé"}</dd>
                <dt>Autor prací</dt>
                <dd>{response.canBeAuthor ? "Ano" : "Ne"}</dd>
                <dt>Hodnotitel prací</dt>
                <dd>{response.canBeEvaluator ? "Ano" : "Ne"}</dd>
            </dl>
        );
    } else {
        return <p>Missing data</p>;
    }
};

export default UserDisplay;
