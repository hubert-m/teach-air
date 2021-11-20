import React, {useEffect, useState} from "react";
import {getAllUsers} from "../../helpers/User";
import Container from "./Container";
import {withRouter} from "react-router";
import {StatusUser, StatusUserName} from "../../constants/StatusUser";

const Users = () => {

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
                    <th scope="col">Status</th>
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
                                            className="badge bg-success">{StatusUserName[StatusUser.TEACHER]}</span>
                                        </td>
                                    ) : (
                                        <td><span
                                            className="badge bg-success">{StatusUserName[StatusUser.STUDENT]}</span>
                                        </td>
                                    )
                        }
                    </tr>
                ))}
                </tbody>
            </table>
        </Container>
    )

}

export default withRouter(Users);