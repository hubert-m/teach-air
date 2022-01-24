import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown, faTrash, faBookmark, faEnvelope, faCode, faMagic, faSchool, faGraduationCap, faUniversity, faHeart, faBook} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Icons = {
    1: <FontAwesomeIcon icon={faBookmark}/>,
    2: <FontAwesomeIcon icon={faTrash}/>,
    3: <FontAwesomeIcon icon={faCrown}/>,
    4: <FontAwesomeIcon icon={faEnvelope}/>,
    5: <FontAwesomeIcon icon={faCode}/>,
    6: <FontAwesomeIcon icon={faMagic}/>,
    7: <FontAwesomeIcon icon={faSchool}/>,
    8: <FontAwesomeIcon icon={faGraduationCap}/>,
    9: <FontAwesomeIcon icon={faUniversity}/>,
    10: <FontAwesomeIcon icon={faHeart}/>,
    11: <FontAwesomeIcon icon={faBook}/>
}

const IconsOptions = [
    {value: 1, label: <FontAwesomeIcon icon={faBookmark}/>,},
    {value: 2, label: <FontAwesomeIcon icon={faTrash}/>,},
    {value: 3, label: <FontAwesomeIcon icon={faCrown}/>,},
    {value: 4, label: <FontAwesomeIcon icon={faEnvelope}/>,},
    {value: 5, label: <FontAwesomeIcon icon={faCode}/>,},
    {value: 6, label: <FontAwesomeIcon icon={faMagic}/>,},
    {value: 7, label: <FontAwesomeIcon icon={faSchool}/>,},
    {value: 8, label: <FontAwesomeIcon icon={faGraduationCap}/>,},
    {value: 9, label: <FontAwesomeIcon icon={faUniversity}/>,},
    {value: 10, label: <FontAwesomeIcon icon={faHeart}/>,},
    {value: 11, label: <FontAwesomeIcon icon={faBook}/>,},
]

export {
    Icons,
    IconsOptions
}