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
import Settings from "../views/Settings/Settings";
import MainCourses from "../views/Courses/MainCourses";
import SubCourses from "../views/Courses/SubCourses";
import Activation from "../views/User/Activation";
import HostingFiles from "../views/Hosting/HostingFiles";
import Options from "../views/GlobalSettings/Options";
import Thread from "../views/Threads/Thread";
import ActivationMain from "../views/User/ActivationMain";
import ForgetPassword from "../views/User/ForgetPassword";
import ForgetPasswordWithCode from "../views/User/ForgetPasswordWithCode";
import MainQuizzes from "../views/Quizes/MainQuizzes";
import Quiz from "../views/Quizes/Quiz";
import QuizEdit from "../views/Quizes/QuizEdit";

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
    {path: Routes.GLOBAL_SETTINGS_SITE_OPTIONS, Component: Options, IsAdmin: true},
    {path: Routes.SETTINGS, Component: Settings, IsAuth: true},
    {path: Routes.USER_ACTIVATION_MAIN, Component: ActivationMain},
    {path: Routes.USER_ACTIVATION + ":code", Component: Activation},
    {path: Routes.FORGET_PASSWORD, Component: ForgetPassword},
    {path: Routes.FORGET_PASSWORD_WITH_CODE + ":code", Component: ForgetPasswordWithCode},
    {path: Routes.MAIN_COURSES, Component: MainCourses, IsAuth: true},
    {path: Routes.SUB_COURSES + ":id", Component: SubCourses, IsAuth: true},
    {path: Routes.HOSTING_FILES, Component: HostingFiles, IsAuth: true},
    {path: Routes.THREAD + ":id", Component: Thread, IsAuth: true},
    {path: Routes.QUIZZES, Component: MainQuizzes, IsAuth: true},
    {path: Routes.QUIZ_EDIT + ":id", Component: QuizEdit, IsAuth: true},
    {path: Routes.QUIZ + ":id", Component: Quiz, IsAuth: true},
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
