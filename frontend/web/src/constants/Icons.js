import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown, faTrash, faBookmark} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Icons = {
    1: <FontAwesomeIcon icon={faBookmark}/>,
    2: <FontAwesomeIcon icon={faTrash}/>,
    3: <FontAwesomeIcon icon={faCrown}/>
}

const IconsOptions = [
    {value: 1, label: <FontAwesomeIcon icon={faBookmark}/>,},
    {value: 2, label: <FontAwesomeIcon icon={faTrash}/>,},
    {value: 3, label: <FontAwesomeIcon icon={faCrown}/>,},
]

export {
    Icons,
    IconsOptions
}