import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {getMe, getToken} from "../helpers/User";
import Routes from "../constants/Routes";

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
            {!!getToken() ? (<p>Jesteś zalogowany jako {userData?.name} {userData?.lastname}</p>) : (
                <Link to={Routes.LOGIN}>Zaloguj się</Link>)}
        </>
    );

}

export default Home;