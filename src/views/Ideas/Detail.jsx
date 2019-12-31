import React, {useState} from "react";
import { useParams } from "react-router-dom";
import Display from "./Display";
// import DisplayTargets from "./DisplayTargets";
import Edit from "./Edit";

/**
 * Idea Detail Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const Detail = (props) => {
    const { id } = useParams();
    const [ editing, setEditing ] = useState(false);

    // TODO: de-fake
    const fakeData = JSON.parse(localStorage.getItem("fakeIdeasData"));

    if (editing) {
        return <Edit id={ id } switchEditMode={ setEditing } />
    } else {
        return (
            <>
                <Display id={ id } switchEditMode={ setEditing } />
            </>
        );
    }
};

export default Detail;
