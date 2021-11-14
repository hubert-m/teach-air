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
        if(!!userToken) {
            getMe().then(userDataTmp => {
                setUserData(userDataTmp);
            }).catch(errorMessage => {
                alert(errorMessage);
            });
        } else {
            setUserToken(getToken());
        }
    }, [userToken])

    return (
        <>
            <Header history={history} userData={userData} userToken={userToken}/>
            <Routes userToken={userToken} setUserToken={setUserToken} userData={userData} setUserData={setUserData}/>
            <Footer />
        </>
    );
}

export default App;