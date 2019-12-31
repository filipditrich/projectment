import React, { useState, useMemo, useCallback } from "react";
import { useAppContext } from "../../providers";
import { Link } from "react-router-dom";
import { BoolColumnFilter, Table } from "../../components";
import {fakePromise, fakeIdeaData, getRandomInt} from "../../utils";
import { get, chunk, orderBy } from "lodash";

/**
 * Idea List Component
 * @returns {*}
 * @constructor
 */
export const List = (props) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    const [ data, setData ] = useState([]);
    const [ totalPages, setTotalPages ] = useState(0);
    const { accessToken } = useAppContext();

    const columns = useMemo(() => [
        { Header: "Název", accessor: "name" },
        { Header: "Předmět", accessor: "subject" },
        { Header: "Jméno", accessor: "user.firstName" },
        { Header: "Příjmení", accessor: "user.lastName" },
        { Header: "Cílové skupiny", accessor: "ideaTargets" },
        { Header: "Nabízený", accessor: "offered", disableSortBy: true, Cell: (data) => (data.cell.value === true ? "Ano" : "Ne"), Filter: BoolColumnFilter },
        { Header: "Akce", Cell: (data) => (<Link to={"/ideas/" + data.row.original.id}>Detail</Link>) },
    ], []);

    // TODO: de-fake
    const fakeData = JSON.parse(localStorage.getItem("fakeIdeasData"));

    const fetchData = useCallback(({ page, size, sort, filters }) => {
        (async() => {
            setIsLoading(true);
            setError(false);
            let res, json;
            let parameters = [];

            let order = sort[0] ? sort[0].id : undefined;
            if (order) order = order.toLowerCase();
            // if (order && sort[0].desc) order = order + "_desc"; // TODO: de-comment

            if (page) parameters.push("page=" + page);
            if (size) parameters.push("pageSize=" + size);
            if (order) parameters.push("order=" + order);

            if (Array.isArray(filters)) {
                for (let f of filters) {
                    // TODO: f.id case "firstname" never occurs, comes in as "user.firstName" etc...ERROR?
                    switch (f.id) {
                        case "name": parameters.push("name=" + f.value.toString()); break;
                        case "subject": parameters.push("subject=" + f.value.toString()); break;
                        case "userId": parameters.push("userId=" + f.value.toString()); break;
                        case "firstname": parameters.push("firstname=" + f.value.toString()); break;
                        case "lastname": parameters.push("lastname=" + f.value.toString()); break;
                        case "offered": parameters.push("offered=" + f.value.toString()); break;
                        case "target": parameters.push("target=" + f.value.toString()); break;
                        default: break;
                    }
                }
            }

            try {
                // TODO: de-fake
                res = await fakePromise(getRandomInt(100, 500), {
                    ok: true,
                    json: () => {
                        return {
                            data: () => {
                                let data = fakeData;

                                // filter
                                data = data.filter((value, index, array) => {
                                    // value: { id: "123", name: "Testing", ... }
                                    let filterOut = false;
                                    for (let f of filters)
                                        filterOut = get(value, f.id)
                                            ? !get(value, f.id).toString().toLowerCase().includes(f.value.toString().toLowerCase())
                                            : true;
                                    return !filterOut;
                                });

                                // order + sort
                                if (order && sort.length)
                                    data = orderBy(data, sort.map((sortee) => sortee.id), sort.map((sortee) => sortee.desc ? 'desc' : 'asc'));

                                // page size + page
                                if (size) data = chunk(data, size)[page || 0];

                                return data;
                            },
                        };
                    },
                    statusText: '200 OK',
                    status: 200,
                });
                // res = await fetch(process.env.REACT_APP_API_URL + "/ideas?" + parameters.join("&"), {
                //     method: "GET",
                //     headers: { Authorization: "Bearer " + accessToken }
                // });

                if (res.ok) {
                    json = await res.json().data();
                    setData(json || []);
                    // setTotalPages(json.pages); // TODO: de-comment
                    setTotalPages(size ? chunk(fakeData, size).length : 1);
                } else {
                    throw new Error(res.statusText);
                }
            } catch (error) {
                setError({ status: res.status, text: error.message });
            } finally {
                setIsLoading(false);
            }
        })();
    }, [ accessToken ]);

    return <Table columns={ columns } data={ data } fetchData={ fetchData } isLoading={ isLoading } error={ error } totalPages={ totalPages } />;
};

export default List;
