import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown, faTrash} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Icons = {
    1: <FontAwesomeIcon icon={faTrash}/>,
    2: <FontAwesomeIcon icon={faCrown}/>
}

const IconsOptions = [
    {value: 1, label: <FontAwesomeIcon icon={faTrash}/>,},
    {value: 2, label: <FontAwesomeIcon icon={faCrown}/>,},
]

export {
    Icons,
    IconsOptions
}