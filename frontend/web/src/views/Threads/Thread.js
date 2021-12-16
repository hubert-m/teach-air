import React from "react";
import {useParams} from "react-router";

const Thread = () => {
    let {id} = useParams();

    return (
        <h1>Wątek {id}</h1>
    )
}

export default Thread;