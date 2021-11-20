import React, {useEffect, useState} from "react";
import {getAllUsers} from "../../helpers/User";
import Container from "./Container";
import {withRouter} from "react-router";
import {StatusUser, StatusUserName} from "../../constants/StatusUser";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGraduationCap, faCheckCircle, faCrown, faUser} from '@fortawesome/free-solid-svg-icons';

const Users = ({userData}) => {

    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        getAllUsers().then(list => {
            setUsersList(list);
        }).catch(() => {
        })
    }, [])

    return (
        <Container>
            <div className="jumbotron">
                <h1 className="display-7">Użytkownicy</h1>
                <hr className="my-4"/>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Imię</th>
                    <th scope="col">Nazwisko</th>
                    <th scope="col">Płeć</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Telefon</th>
                    <th scope="col" colSpan={3}>Status</th>
                </tr>
                </thead>
                <tbody>
                {usersList.map(({id, email, name, second_name, lastname, sex_id, phone, status}) => (
                    <tr>
                        <th scope="row">{id}</th>
                        <td>{name} {second_name}</td>
                        <td>{lastname}</td>
                        <td>{sex_id?.value}</td>
                        <td>{email}</td>
                        <td>{phone}</td>
                        {status === StatusUser.ADMIN ?
                            (
                                <td><span className="badge bg-danger">{StatusUserName[StatusUser.ADMIN]}</span>
                                </td>
                            ) : status === StatusUser.UNACTIVATED ?
                                (
                                    <td><span
                                        className="badge bg-secondary">{StatusUserName[StatusUser.UNACTIVATED]}</span>
                                    </td>
                                ) : status === StatusUser.TEACHER ?
                                    (
                                        <td><span
                                            className="badge bg-warning">{StatusUserName[StatusUser.TEACHER]}</span>
                                        </td>
                                    ) : (
                                        <td><span
                                            className="badge bg-success">{StatusUserName[StatusUser.STUDENT]}</span>
                                        </td>
                                    )
                        }
                        {id !== userData?.id && status === StatusUser.UNACTIVATED ? (
                            <>
                                <td>
                                    <button type="button" className="btn btn-success"><FontAwesomeIcon
                                        icon={faCheckCircle}/>
                                    </button>
                                </td>
                                <td>&nbsp;</td>
                            </>
                        ) : id !== userData?.id && status === StatusUser.STUDENT ? (
                            <>
                                <td>
                                    <button type="button" className="btn btn-warning"><FontAwesomeIcon
                                        icon={faGraduationCap}/>
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-danger"><FontAwesomeIcon icon={faCrown}/>
                                    </button>
                                </td>
                            </>
                        ) : id !== userData?.id && status === StatusUser.TEACHER ? (
                            <>
                                <td>
                                    <button type="button" className="btn btn-primary"><FontAwesomeIcon icon={faUser}/>
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-danger"><FontAwesomeIcon icon={faCrown}/>
                                    </button>
                                </td>
                            </>
                        ) : id !== userData?.id && status === StatusUser.ADMIN ? (
                            <>
                                <td>
                                    <button type="button" className="btn btn-primary"><FontAwesomeIcon icon={faUser}/>
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-warning"><FontAwesomeIcon
                                        icon={faGraduationCap}/>
                                    </button>
                                </td>
                            </>
                        ) : (
                            <td colspan={2}><span
                                className="badge bg-success">Aktualnie zalogowany</span></td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </Container>
    )

}

export default withRouter(Users);