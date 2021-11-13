import React, {useEffect, useState} from 'react';
import Routes from './routes';
import Header from "./components/Header";
import {useHistory} from "react-router";
import {getMe, getToken} from "./helpers/User";
import Footer from "./components/Footer";
import "./App.css";

function App() {
    const [userToken, setUserToken] = useState(getToken());
    const [userData, setUserData] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if(!!getToken()) {
            getMe().then(userDataTmp => {
                setUserData(userDataTmp);
            }).catch(errorMessage => {
                alert(errorMessage);
            });
        }
    }, [userToken])

    return (
        <>
            <Header history={history} userData={userData}/>
            <Routes userData={userData}/>
            <Footer />
        </>
    );
}

export default App;