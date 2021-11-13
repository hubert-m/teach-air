import React, {Component} from 'react';
import {Route, Switch} from "react-router";

import {
    Login, PageNotFound, Dashboard, Home
} from '../views';
import RequireAuth from "./requireAuth";
import Container from "../components/Container";
import Routes from "../constants/Routes";


export default class Router extends Component {
    render() {
        return (
            <React.Fragment>
                <Container>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path={Routes.LOGIN} component={Login}/>
                        {RequireAuth(<Route exact path='/dashboard' component={Dashboard}/>)}
                        <Route exact path='*' component={PageNotFound}/>
                    </Switch>
                </Container>
            </React.Fragment>
        );
    }
};
