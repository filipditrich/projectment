import React from "react";
import { Link } from "react-router-dom";
import List from "./List";

/**
 * Main Ideas View
 * @constructor
 */
export const Ideas = (props) => {

    return(
        <>
            <header className="d-flex justify-content-between align-items-center mb-3">
                <h1>Náměty</h1>
                <Link to="/ideas/create"><i className="fa fa-plus-square-o font-3xl" /></Link>
            </header>
            <List />
        </>
    );
};

export default Ideas;
