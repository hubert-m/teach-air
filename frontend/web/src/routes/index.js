import React, {Component} from 'react';
import {Route, Switch} from "react-router-dom";
import Routes from "../constants/Routes";
import RequireAuth from "./requireAuth";
import Register from "../views/Register";
import Home from "../views/Home";
import Login from "../views/Login";
import Logout from "../views/Logout";
import PageNotFound from "../views/PageNotFound";
import GlobalSettingsHome from "../views/GlobalSettings/GlobalSettingsHome";
import Users from "../views/GlobalSettings/Users";
import Sex from "../views/GlobalSettings/Sex";
import RequireAuthAdmin from "./requireAuthAdmin";
import ScrollToTop from "../helpers/ScrollToTop";
import MessagesList from "../views/Messages/MessagesList";
import MessagesConversation from "../views/Messages/MessagesConversation";

const routes = [
    {path: '/', Component: Home},
    {path: Routes.LOGIN, Component: Login},
    {path: Routes.LOGOUT, Component: Logout, IsAuth: true},
    {path: Routes.REGISTER, Component: Register},
    {path: Routes.MESSAGES_LIST, Component: MessagesList, IsAuth: true},
    {path: Routes.MESSAGES_WITH_USER + ":id", Component: MessagesConversation, IsAuth: true},
    {path: Routes.GLOBAL_SETTINGS, Component: GlobalSettingsHome, IsAdmin: true},
    {path: Routes.GLOBAL_SETTINGS_USERS, Component: Users, IsAdmin: true},
    {path: Routes.GLOBAL_SETTINGS_SEX, Component: Sex, IsAdmin: true},
    {path: '*', Component: PageNotFound},
]


const Router = ({userToken, setUserToken, userData, setUserData}) => {

    const Element = (() => {
        return (
            <Switch>
                {routes.map(({path, Component, IsAuth, IsAdmin}) => (
                    <Route key={path} exact path={path}>
                        <div className="page">
                            {IsAuth ? RequireAuth(
                                <Component userToken={userToken} setUserToken={setUserToken} userData={userData}
                                           setUserData={setUserData}/>
                            ) : IsAdmin ? RequireAuthAdmin(
                                <Component userToken={userToken} setUserToken={setUserToken} userData={userData}
                                           setUserData={setUserData}/>, userData?.status
                            ) : (
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
                <ScrollToTop>
                    <Element/>
                </ScrollToTop>
            </div>
        </React.Fragment>
    );
}

export default Router;
