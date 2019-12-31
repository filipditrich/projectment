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
            <h1>Náměty</h1>
            <Link to="/ideas/create">Nový</Link>
            {/*<Link to="/ideas/list">Seznam</Link>*/}
            <List />
        </>
    );
};

export default Ideas;
