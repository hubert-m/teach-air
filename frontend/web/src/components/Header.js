import React from 'react';
import {getToken, logout} from '../helpers/User';
import Routes from "../constants/Routes";
import Settings from "../constants/Settings";

function Header({history, userData}) {

    const handleLogout = () => {
        history.push(Routes.LOGOUT);
    }

    const handleLogin = () => {
        history.push(Routes.LOGIN);
    }

    return (
        <nav className="navbar navbar-light bg-light">
            <a className="navbar-brand" href={Routes.HOME}>{Settings.TITLE}</a>

            {getToken() ? (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleLogout()}>Wyloguj
                </button>
            ) : (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleLogin()}>Zaloguj się
                </button>)}
        </nav>
    );
}


export default Header;
