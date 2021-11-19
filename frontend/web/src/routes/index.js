import React, {Component} from 'react';
import {Route, Switch} from "react-router-dom";
import Routes from "../constants/Routes";
import RequireAuth from "./requireAuth";
import Register from "../views/Register";
import Home from "../views/Home";
import Login from "../views/Login";
import Logout from "../views/Logout";
import PageNotFound from "../views/PageNotFound";

const routes = [
    {path: '/', Component: Home},
    {path: Routes.LOGIN, Component: Login},
    {path: Routes.LOGOUT, Component: Logout, IsAuth: true},
    {path: Routes.REGISTER, Component: Register},
    {path: '*', Component: PageNotFound},
]


const Router = ({userToken, setUserToken, userData, setUserData}) => {

    const Element = (() => {
        return (
            <Switch>
                {routes.map(({path, Component, IsAuth}) => (
                    <Route key={path} exact path={path}>
                        <div className="page">
                            {IsAuth ? RequireAuth(
                                    <Component userToken={userToken} setUserToken={setUserToken} userData={userData}
                                               setUserData={setUserData}/>
                                ) :
                                (
                                    <Component userToken={userToken} setUserToken={setUserToken} userData={userData}
                                               setUserData={setUserData}/>
                                )
                            }
                        </div>
                    </Route>
                ))}
            </Switch>
        )
    });


    return (
        <React.Fragment>
            <div className="container content-page">
                <Element/>
            </div>
        </React.Fragment>
    );
}

export default Router;
