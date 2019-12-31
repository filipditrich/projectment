import React, { useEffect, useState } from 'react';
import { useAppContext } from "../../providers";
import {fakePromise, getRandomInt, useFetch} from "../../utils";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { find } from "lodash";

/**
 * Idea Edit Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const Edit = (props) => {
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
    const { response, error, isLoading } = useFetch(find(JSON.parse(localStorage.getItem('fakeIdeasData')), { id: props.id }));
    // const {response, error, isLoading} = useFetch(process.env.REACT_APP_API_URL + "/ideas/" + props.id,{
    //     method: "GET",
    //     headers: {
    //         Authorization: "Bearer " + accessToken
    //     }
    // });

    if (isLoading) {
        return <p>Nahrávání dat</p>;
    } else if (error) {
        return <div>{error.text + " (" + error.status + ")"}</div>;
    } else if (response) {
        return (
            <Formik
                initialValues={{
                    name: response.name,
                    description: response.description,
                    resources: response.resources,
                    participants: response.participants,
                    subject: response.subject,
                    offered: response.offered
                }}
                validate={values=>{
                    let errors = {};
                    if (!values.name) errors.name = "Vyplňte název námětu";
                    if (!values.description) errors.description = "Vyplňte popis námětu";
                    if (!values.resources) errors.resources = "Vyplňte očekávané zdroje";
                    if (values.participants === null) errors.participants = "Vyplňte počet autorů";
                    if (!values.subject) errors.subject = "Vyplňte zkratu předmětu, do kterého by zadání spadalo";
                    return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
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
                        switchEditMode(false);
                    } else {
                        setFailed(res.statusText);
                    }
                    setSubmitting(false);
                }}
            >
                {({isSubmitting, errors, touched, values, setFieldValue}) => (
                    <Form>
                        {(failed !== false) ? <p>Uložení námětu se nepodařilo.</p> : ""}
                        {(ok !== false) ? <p>Námět byl uložen.</p> : ""}
                        <div>
                            <label htmlFor="name">Název</label>
                            <Field type="text" name="name" className={errors.name ? "danger" : (touched.name ? "success" : "")} />
                            <ErrorMessage name="name">{msg => <p>{msg}</p>}</ErrorMessage>
                        </div>
                        <div>
                            <label htmlFor="description">Popis</label>
                            <Field as="textarea" name="description" className={errors.description ? "danger" : (touched.description ? "success" : "")} />
                            <ErrorMessage name="description">{msg => <p>{msg}</p>}</ErrorMessage>
                        </div>
                        <div>
                            <label htmlFor="subject">Předmět</label>
                            <Field type="text" name="subject" className={errors.subject ? "danger" : (touched.subject ? "success" : "")} />
                            <ErrorMessage name="subject">{msg => <p>{msg}</p>}</ErrorMessage>
                        </div>
                        <div>
                            <label htmlFor="resources">Zdroje</label>
                            <Field type="text" name="resources" className={errors.resources ? "danger" : (touched.resources ? "success" : "")} />
                            <ErrorMessage name="resources">{msg => <p>{msg}</p>}</ErrorMessage>
                        </div>
                        <div>
                            <label htmlFor="participants">Počet řešitelů</label>
                            <Field type="number" name="participants" className={errors.participants ? "danger" : (touched.participants ? "success" : "")} />
                            <ErrorMessage name="participants">{msg => <p>{msg}</p>}</ErrorMessage>
                        </div>
                        <div>
                            <label>
                                <Field type="checkbox" name="offered" className={errors.offered ? "danger" : (touched.offered ? "success" : "")} checked={values.offered} onChange={() => setFieldValue("offered", !values.offered)} />
                                Nabízené jako zadání
                            </label>
                        </div>
                        <div>
                            <button className="button button-primary button-reverse mr-3" type="submit" color="primary" disabled={isSubmitting}><span>{!isSubmitting ? "Uložit" : "Pracuji..."}</span></button>
                            <button className="button button-primary" onClick={()=>{switchEditMode(false)}}><span>Zpět</span></button>
                        </div>
                    </Form>
                )}
            </Formik>
        );
    } else {
        return <p>Missing data</p>;
    }
};

export default Edit;
