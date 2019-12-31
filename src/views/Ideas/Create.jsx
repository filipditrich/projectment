import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { withRouter } from "react-router-dom";
// import { useAppContext } from "../../providers";
import { fakePromise, getRandomInt } from "../../utils";

/**
 * Create Idea Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const Create = (props) => {
    // const { accessToken, userId } = useAppContext();
    const [ failed, setFailed ] = useState(false);
    const [ ok, setOk ] = useState(false);
    useEffect(() => {
        setFailed(false);
        setOk(false);
    },[]);

    return (
        <Formik
            initialValues={{
                name: "",
                description: "",
                resources: "",
                participants: 1,
                subject: "",
                offered: false
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
                    json: () => {
                        return {
                            id: "fake-id",
                        };
                    },
                    statusText: "200 OK",
                    status: 200,
                });
                // const res = await fetch(process.env.REACT_APP_API_URL + "/ideas", {
                //     method: "POST",
                //     headers: {
                //         Authorization: "Bearer " + accessToken,
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify({
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
                    let json = await res.json();
                    setOk(true);
                    props.history.push("/ideas/" + json.id);
                } else {
                    setFailed(res.statusText);
                }
                setSubmitting(false);
            }}
        >
            {({isSubmitting, errors, touched, values, setFieldValue}) => (
                <Form>
                    {(failed !== false) ? <p>Vytvoření námětu se nepodařilo.</p> : ""}
                    {(ok !== false) ? <p>Námět byl vytvořen.</p> : ""}
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
                        <button className="button button-primary button-reverse" type="submit" disabled={isSubmitting}><span>{!isSubmitting ? "Vytvořit" : "Pracuji..."}</span></button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default withRouter(Create);
