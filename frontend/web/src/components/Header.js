import React, {useState} from 'react';
import Routes from "../constants/Routes";
import Settings from "../constants/Settings";
import {NavLink} from 'react-router-dom'
import {Navbar, Container, Nav, NavDropdown, Badge} from "react-bootstrap";
import {StatusUser} from "../constants/StatusUser";
import {Twemoji} from "react-emoji-render";

function Header({userData, userToken}) {
    const [expanded, setExpanded] = useState(false);
    console.log(expanded);

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top" expanded={expanded}>
            <Container>
                <Navbar.Brand as={NavLink} to={Routes.HOME} onClick={() => setExpanded(false)}><Twemoji
                    text={":airplane:"}/> {Settings.TITLE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"
                               onClick={() => setExpanded(expanded ? false : "expanded")}/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto" />
                    <Nav>
                        {userToken ? (
                            <>
                                <Nav.Link as={NavLink} to={Routes.MAIN_COURSES}
                                          onClick={() => setExpanded(false)}>Kursy</Nav.Link>
                                <Nav.Link as={NavLink} to={Routes.QUIZ}
                                          onClick={() => setExpanded(false)}>Quiz</Nav.Link>
                                <Nav.Link as={NavLink} to={Routes.MESSAGES_LIST}
                                          onClick={() => setExpanded(false)}>
                                    Wiadomości
                                    {userData?.unread_messages != 0 && (
                                        <Badge bg="primary">{userData?.unread_messages}</Badge>
                                    )}
                                </Nav.Link>
                                <Nav.Link as={NavLink} to={Routes.HOSTING_FILES} onClick={() => setExpanded(false)}>Hosting
                                    plików</Nav.Link>
                                {userData?.status ==StatusUser.ADMIN && (
                                    <NavDropdown title="Admin" id="collasible-nav-dropdown">
                                        <NavDropdown.Item as={NavLink} to={Routes.GLOBAL_SETTINGS}
                                                          onClick={() => setExpanded(false)}>Ustawienia
                                            Globalne</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                                <NavDropdown title="Konto" id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={NavLink} to={Routes.SETTINGS}
                                                      onClick={() => setExpanded(false)}>Ustawienia</NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to={Routes.LOGOUT}
                                                      onClick={() => setExpanded(false)}>Wyloguj</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to={Routes.LOGIN} onClick={() => setExpanded(false)}>Logowanie</Nav.Link>
                                <Nav.Link as={NavLink} to={Routes.REGISTER} onClick={() => setExpanded(false)}>Rejestracja</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}


export default Header;
