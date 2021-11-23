import React, {useState} from 'react';
import {useParams} from "react-router";

const MessagesConversation = () => {
    let { id } = useParams();
    return (
        <h1>ID usera z ktorym piszemy: {id}</h1>
    )
}

export default MessagesConversation;