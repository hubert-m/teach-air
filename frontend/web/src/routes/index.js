import React, {Component} from 'react';
import {Route, Switch} from "react-router";

import {
    Login, PageNotFound, Dashboard, Home, Logout
} from '../views';
import RequireAuth from "./requireAuth";
import Container from "../components/Container";
import Routes from "../constants/Routes";


const Router = ({userToken, setUserToken, userData, setUserData}) => {
    return (
        <React.Fragment>
            <Container>
                <Switch>
                    <Route exact path='/'
                           render={() => <Home userToken={userToken} userData={userData}
                           />}/>
                    <Route exact path={Routes.LOGIN} render={() => <Login setUserToken={setUserToken}/>}/>
                    {RequireAuth(<Route exact path='/logout' render={() => <Logout setUserToken={setUserToken}
                                                                                   setUserData={setUserData}/>}/>)}
                    <Route exact path='*' component={PageNotFound}/>
                </Switch>
            </Container>
        </React.Fragment>
    );
}

export default Router;
