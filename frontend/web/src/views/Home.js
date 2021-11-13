import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {getMe, getToken} from "../helpers/User";
import Routes from "../constants/Routes";
import {StatusUserName} from "../constants/StatusUser";

function Home() {

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!!getToken()) {
            getMe().then(userDataTmp => {
                setUserData(userDataTmp)
            }).catch(errorMessage => {
                alert(errorMessage);
            });
        }
    }, [])
    console.log(userData);
    return (
        <>
            <h1>Strona Główna - Teach Air</h1>
            <h2>Projekt inżynierski</h2>
            {!!getToken() ? (
                <>
                <p>Jesteś zalogowany jako {userData?.name} {userData?.second_name} {userData?.lastname}</p>
                    <p>E-mail: {userData?.email}</p>
                    <p>Płeć: {userData?.sex_id}</p>
                    <p>Status: {StatusUserName[userData?.status]} - {userData?.status}</p>
                </>
            ) : (
                <Link to={Routes.LOGIN}>Zaloguj się</Link>
            )}
        </>
    );

}

export default Home;