import React from 'react';
import { Redirect } from 'react-router-dom';
import Routes from "../constants/Routes";
import {StatusUser} from "../constants/StatusUser";

const RequireAuthAdmin = (component, status) => {
    if (status === StatusUser.ADMIN)
        return component;
    return  <Redirect to={Routes.HOME}/>;
};

export default RequireAuthAdmin;
