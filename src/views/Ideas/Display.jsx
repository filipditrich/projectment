import React, { useState, useEffect } from "react";
// import { useAppContext } from "../../providers";
import { fakePromise, getRandomInt, useFetch } from "../../utils";
import { find } from "lodash";
import { Modal } from "../../components/common";
import { useHistory } from "react-router";
import UserDisplay from "./UserDisplay";

/**
 * Idea Display Detail Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const Display = (props) => {
    // const { accessToken } = useAppContext();
    const [ showDelete, setShowDelete ] = useState(false);
    const [ isDeleting, setIsDeleting ] = useState(false);
    let history = useHistory();

    useEffect(() => {
        setShowDelete(false);
        setIsDeleting(false);
        return () => { setShowDelete(false); setIsDeleting(false); };
    },[]);

    // TODO: de-fake
    const { response, error, isLoading } = useFetch(find(JSON.parse(localStorage.getItem("fakeIdeasData")), { id: props.id }));
    // const { response, error, isLoading } = useFetch(process.env.REACT_APP_API_URL + "/ideas/" + props.id,{
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
            <>
                <h1>Obecná data</h1>
                <dl>
                    <dt>Název</dt>
                    <dd>{response.name}</dd>
                    <dt>Popis</dt>
                    <dd>{response.description}</dd>
                    <dt>Id</dt>
                    <dd>{response.id}</dd>
                    <dt>Nabízené</dt>
                    <dd>{response.offered ? "Ano" : "Ne"}</dd>
                    <dt>Prostředky</dt>
                    <dd>{response.resources}</dd>
                    <dt>Předmět</dt>
                    <dd>{response.subject}</dd>
                    <dt>Počet řešitelů</dt>
                    <dd>{response.participants}</dd>
                </dl>
                <div>
                    <button className="button button-primary button-reverse mr-3" onClick={()=>{ props.switchEditMode(true) } }><span>Editace</span></button>
                    <button className="button button-danger button-reverse" onClick={()=>{ setShowDelete(true) } }><span>Smazání</span></button>
                </div>
                <h1>Autor</h1>
                <UserDisplay id={ response.user.id } />
                <Modal
                    isOpen={ showDelete }
                    onDismiss={ () => setShowDelete(false) }
                    title="Odstranění námětu"
                    className="modal-danger"
                    actions={
                        <>
                            <button
                                onClick={
                                    async () => {
                                        setIsDeleting(true);

                                        await fakePromise(getRandomInt(100, 750));
                                        history.push("/ideas");
                                    }
                                }
                                className="button button-danger button-reverse"
                                disabled={isDeleting}>
                                <span>{ !isDeleting ? "Odstranit" : "Pracuji..." }</span>
                            </button>
                            <button
                                onClick={ () => { setShowDelete(false) } }
                                className="button button-danger">
                                <span>Zavřít</span>
                            </button>
                        </>
                    }
                >
                    <p>Opravdu si přejete odstranit námět?</p>
                </Modal>
            </>
        );
    } else {
        return <p>Missing data</p>;
    }
};

export default Display;
