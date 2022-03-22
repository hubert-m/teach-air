import {isEmpty} from "lodash";
import {StatusUser, StatusUserName} from "../../../constants/StatusUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const ListOfMembers = ({members, handleDeleteMember}) => {
    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h2>Lista członków</h2>
                <hr className="my-4"/>
            </div>

            {isEmpty(members) ? (<p>Brak</p>) : (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Imię</th>
                            <th scope="col">Nazwisko</th>
                            <th scope="col">E-mail</th>
                            <th scope="col" colSpan={2}>&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {members.map(({
                                          id,
                                          email,
                                          name,
                                          second_name,
                                          lastname,
                                          show_email,
                                          is_author,
                                          is_author_or_member_of_one_of_parent,
                                          status
                                      }) => (

                            <tr key={id}>
                                <th scope="row">{id}</th>
                                <td>{name} {second_name}</td>
                                <td>{lastname}</td>
                                <td>{show_email == "1" ? email : "(ukryty)"}</td>
                                {status == StatusUser.ADMIN ?
                                    (
                                        <td><span className="badge bg-danger">{StatusUserName[StatusUser.ADMIN]}</span>
                                        </td>
                                    ) : status == StatusUser.UNACTIVATED ?
                                        (
                                            <td><span
                                                className="badge bg-secondary">{StatusUserName[StatusUser.UNACTIVATED]}</span>
                                            </td>
                                        ) : status == StatusUser.TEACHER ?
                                            (
                                                <td><span
                                                    className="badge bg-warning">{StatusUserName[StatusUser.TEACHER]}</span>
                                                </td>
                                            ) : (
                                                <td><span
                                                    className="badge bg-primary">{StatusUserName[StatusUser.STUDENT]}</span>
                                                </td>
                                            )
                                }
                                <td>{is_author == 1 ? (
                                    <span className="badge bg-danger">Autor tego kursu</span>
                                ) : is_author_or_member_of_one_of_parent == 1 ? (
                                    <span
                                        className="badge bg-danger">Członek lub autor jednego z kursów nadrzędnych</span>
                                ) : (
                                    <button type="button" className="btn btn-danger"
                                            onClick={() => handleDeleteMember(id)}><FontAwesomeIcon
                                        icon={faTrash}/>
                                    </button>
                                )
                                }</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

export default ListOfMembers;