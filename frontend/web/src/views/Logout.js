import React from 'react';
import {logout} from "../helpers/User";
import Routes from "../constants/Routes";
import {useEffect} from "react";
import {useHistory} from "react-router";


function Logout () {
    const history = useHistory();

    useEffect(() => {
        logout();
        history.push(Routes.HOME);
    }, [])

    return (
        <p>Pomyślnie wylogowano</p>
    )
}

export default Logout;