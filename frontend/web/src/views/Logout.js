import React from 'react';
import {logout} from "../helpers/User";
import Routes from "../constants/Routes";
import {useEffect} from "react";
import {useHistory} from "react-router";


function Logout ({ setUserToken, setUserData }) {
    const history = useHistory();

    useEffect(() => {
        logout();
        setUserToken(null);
        setUserData(null);
        history.push(Routes.HOME);
    }, [])

    return (
        <p>Pomyślnie wylogowano</p>
    )
}

export default Logout;