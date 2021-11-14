import React from "react";
import {Link} from "react-router-dom";
import Routes from "../constants/Routes";
import {StatusUserName} from "../constants/StatusUser";

function Home({userToken, userData}) {

    return (
        <>
            <h1>Strona Główna - Teach Air</h1>
            <h2>Projekt inżynierski</h2>

            {userToken ? (
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