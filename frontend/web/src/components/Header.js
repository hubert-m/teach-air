import React from 'react';
import Routes from "../constants/Routes";
import Settings from "../constants/Settings";
import {NavLink} from 'react-router-dom'
import {Navbar, Container, Nav, NavDropdown} from "react-bootstrap";
import {StatusUser} from "../constants/StatusUser";

function Header({userData, userToken}) {

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand as={NavLink} to={Routes.HOME}>{Settings.TITLE}</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#">Podstrona 1</Nav.Link>
                        <Nav.Link href="#">Podstrona 2</Nav.Link>
                    </Nav>
                    <Nav>
                        {userToken ? (
                            <>
                                <Nav.Link as={NavLink} to={Routes.MAIN_COURSES}>Kursy</Nav.Link>
                                <Nav.Link as={NavLink} to={Routes.MESSAGES_LIST}>Wiadomości</Nav.Link>
                                <NavDropdown title="Konto" id="collasible-nav-dropdown">
                                    {userData?.status === StatusUser.ADMIN && (
                                        <NavDropdown.Item as={NavLink} to={Routes.GLOBAL_SETTINGS}>Ustawienia Globalne</NavDropdown.Item>
                                    )}
                                    <NavDropdown.Item as={NavLink} to={Routes.SETTINGS}>Ustawienia</NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to={Routes.LOGOUT}>Wyloguj</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to={Routes.LOGIN}>Logowanie</Nav.Link>
                                <Nav.Link as={NavLink} to={Routes.REGISTER}>Rejestracja</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}


export default Header;
