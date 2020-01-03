import React, { useEffect, useState } from 'react';
import { useAppContext } from "../../providers";
import { fakePromise, getRandomInt, useFetch} from "../../utils";
import { find } from "lodash";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { loading } from "../../misc";
import IdeaForm from "./IdeaForm";

/**
 * Idea IdeaEdit Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const IdeaEdit = (props) => {
    const {
        switchEditMode,
    } = props;
    const { accessToken , userId } = useAppContext();
    const [ failed, setFailed ] = useState(false);
    const [ ok, setOk ] = useState(false);

    useEffect(() => {
        setFailed(false);
        setOk(false);
    },[]);

    // TODO: de-fake
    const { response, error, isLoading } = useFetch(find(JSON.parse(localStorage.getItem('fakeIdeasData')), { id: props.id }), true);
    // const {response, error, isLoading} = useFetch(process.env.REACT_APP_API_URL + "/ideas/" + props.id,{
    //     method: "GET",
    //     headers: {
    //         Authorization: "Bearer " + accessToken
    //     }
    // });

    if (isLoading) {
        return loading();
    } else if (error) {
        toast(`${ error.text } (${ error.status }).`, {
            type: toast.TYPE.ERROR,
            toastId: 'T_ERR_EDIT_RESPONSE',
            autoClose: false,
        });
    } else if (response) {
        return (
            <>
                <h1 className="mb-3">Upravit "{ response.name }"</h1>
                <IdeaForm
                    initialValues={{
                        name: response.name,
                        description: response.description,
                        resources: response.resources,
                        participants: response.participants,
                        subject: response.subject,
                        offered: response.offered
                    }}
                    validate={
                        (values) => {
                            let errors = {};
                            if (!values.name) errors.name = "Vyplňte název námětu";
                            if (!values.description) errors.description = "Vyplňte popis námětu";
                            if (!values.resources) errors.resources = "Vyplňte očekávané zdroje";
                            if (values.participants === null) errors.participants = "Vyplňte počet autorů";
                            if (!values.subject) errors.subject = "Vyplňte zkratu předmětu, do kterého by zadání spadalo";
                            return errors;
                        }
                    }
                    onSubmit={
                        async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            // TODO: de-fake
                            const res = await fakePromise(getRandomInt(500, 1000), {
                                ok: true,
                                json: () => {},
                                statusText: "200 OK",
                                status: 200,
                            });
                            // const res = await fetch(process.env.REACT_APP_API_URL + "/ideas/" + props.id, {
                            //     method: "PUT",
                            //     headers: {
                            //         Authorization: "Bearer " + accessToken,
                            //         "Content-Type": "application/json"
                            //     },
                            //     body: JSON.stringify({
                            //         Id: Number(props.id),
                            //         Name: values.name,
                            //         Description: values.description,
                            //         Resources: values.resources,
                            //         Participants: values.participants,
                            //         Subject: values.subject,
                            //         Offered: values.offered,
                            //         UserId: userId
                            //     })
                            // });
                            if (res.ok) {
                                setOk(true);
                                toast("Námět byl úspěšně uložen.", {
                                    type: toast.TYPE.SUCCESS,
                                });
                                switchEditMode(false);
                            } else {
                                toast(`Námět nemohl být uložen. (${ res.statusText })`, {
                                    type: toast.TYPE.ERROR,
                                    autoClose: false,
                                });
                                setFailed(res.statusText);
                            }
                            setSubmitting(false);
                        }
                    }
                    footerButtons={
                        ({ isSubmitting }) => (
                            <>
                                <Button className="button button-primary button-reverse" type="submit" disabled={ isSubmitting }>
                                    <span>{ !isSubmitting ? "Uložit" : "Pracuji..." }</span>
                                </Button>
                                <Button className="button button-primary ml-3" onClick={ () => switchEditMode(false) }>
                                    <span>Zpět</span>
                                </Button>
                            </>
                        )
                    }
                />
            </>
        );
    } else {
        return <>No Data</> // TODO: custom <Error /> component
    }
};

export default IdeaEdit;
