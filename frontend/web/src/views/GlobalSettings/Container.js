import React from "react";
import Routes from "../../constants/Routes";
import {Link, NavLink} from "react-router-dom";
import {Nav, NavItem, Container as ContainerReactstrap, Tabs, Tab} from "react-bootstrap";

function Container({children}) {
    return (
        <>
            <div className="jumbotron" style={{marginBottom: '25px'}}>
                <h1 className="display-4">Globalne ustawienia aplikacji</h1>
                <hr className="my-4"/>
                <Nav variant="tabs">
                    <Nav.Item>
                        <Nav.Link as={NavLink} to={Routes.GLOBAL_SETTINGS}>Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={NavLink} to={Routes.GLOBAL_SETTINGS_USERS}>Użytkownicy</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={NavLink} to={Routes.GLOBAL_SETTINGS_SEX}>Płeć</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
            {children}
        </>
    )
}

export default Container