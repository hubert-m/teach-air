import React, {useEffect, useState} from 'react';
import Routes from './routes';
import Header from "./components/Header";
import {useHistory} from "react-router";
import {getMe, getToken} from "./helpers/User";
import Footer from "./components/Footer";
import "./App.css";
import LoaderScreen from "./components/LoaderScreen";

function App() {
    const [userToken, setUserToken] = useState(getToken());
    const [userData, setUserData] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (!!userToken) {
            setShowLoader(true);
            getMe().then(userDataTmp => {
                setUserData(userDataTmp);
            }).catch(errorMessage => {
                alert(errorMessage);
            }).finally(async () => {
                await setShowLoader(false);
            });
        } else {
            setUserToken(getToken());
        }
    }, [userToken])

    return (
        <>
            <Header history={history} userData={userData} userToken={userToken}/>
            <Routes userToken={userToken} setUserToken={setUserToken} userData={userData} setUserData={setUserData}/>
            <Footer/>
            {showLoader && <LoaderScreen/>}
        </>
    );
}

export default App;