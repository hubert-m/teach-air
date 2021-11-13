import React from 'react';
import { Redirect } from 'react-router-dom';
import {getToken} from '../helpers/User';
import Routes from "../constants/Routes";

/**
 * Check if have the Authenticated User.
 * I haven't will redirect user to /login route
 */
const RequireAuth = (component) => {
    if (getToken())
        return component;
    return  <Redirect to={Routes.LOGIN}/>;
};

export default RequireAuth;
