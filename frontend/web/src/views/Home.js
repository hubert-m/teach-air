import React from "react";
import {Link, NavLink} from "react-router-dom";
import Routes from "../constants/Routes";
import {StatusUserName} from "../constants/StatusUser";

function Home({userToken, userData}) {
    return (
        <>
            <div className="jumbotron">
                <h1 className="display-4">Teach Air</h1>
                <p className="lead">Aplikacja wspomagająca prowadzenie szkoleń i kursów online<br/>
                    zrealizowana w języku <span className="badge bg-primary">PHP</span> z wykorzystaniem bazy
                    danych <span className="badge bg-primary">MySQL</span></p>

                <hr className="my-4"/>
                {userToken ? (
                    <>
                        <p>Jesteś zalogowany jako {userData?.name} {userData?.second_name} {userData?.lastname}</p>
                        <p>E-mail: {userData?.email}</p>
                        <p>Płeć: {userData?.sex_id?.value}</p>
                        <p>Status: {StatusUserName[userData?.status]} - {userData?.status}</p>
                    </>
                ) : (
                    <>
                        <p>Zarejestruj się już teraz i bierz udział w zajęciach</p>
                        <p className="lead">
                            <Link className="btn btn-primary btn-lg" to={Routes.REGISTER} role="button">Zarejestruj
                                się</Link>
                        </p>
                    </>
                )}

            </div>
        </>
    );

}

export default Home;