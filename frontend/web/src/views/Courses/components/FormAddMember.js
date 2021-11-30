import React, {useEffect, useState} from "react";
import {isEmpty, isNull, size} from "lodash";
import {getSearchUsers} from "../../../helpers/User";
import LoaderScreen from "../../../components/LoaderScreen";
import {StatusUser, StatusUserName} from "../../../constants/StatusUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {sortDesc} from "../../../helpers/sort";
import {addMember, getMembersOfCourse} from "../../../helpers/Course";
import SweetAlert from "react-bootstrap-sweetalert";

const FormAddMember = ({courseId}) => {
    const [loadOptions, setLoadOptions] = useState([]);
    const [members, setMembers] = useState([]);
    const [lengthKeywordWhenOneRecord, setLengthKeywordWhenOneRecord] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showError, setShowError] = useState(false);
    const [data, setData] = useState({
        keyword: '',
    });

    useEffect(() => {
        setShowLoader(true);
        getMembersOfCourse(courseId).then(list => {
            sortDesc(list, "id");
            setMembers(list);
        }).catch((e) => {
            setErrorMessage(e);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }, [courseId])

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))

        if (e.target.value.length >= 3) {

            if (size(loadOptions) === 1 && isNull(lengthKeywordWhenOneRecord)) {
                setLengthKeywordWhenOneRecord(e.target.value.length);
            }

            if (size(loadOptions) > 1) {
                setLengthKeywordWhenOneRecord(null);
            }

            if (e.target.value.length < lengthKeywordWhenOneRecord || isNull(lengthKeywordWhenOneRecord)) {
                setShowLoader(true);
                getSearchUsers(e.target.value, courseId).then(list => {
                    sortDesc(list, "id");
                    setLoadOptions(list);
                }).catch(() => {
                }).finally(async () => {
                    await setShowLoader(false);
                })
            }
        } else if (e.target.value.length === 0) {
            setLoadOptions([]);
        }
    }

    const handleAddMember = (course_id, user_id) => {
        setShowLoader(true);
        addMember(course_id, user_id).then(() => {
            getMembersOfCourse(courseId).then(list => {
                sortDesc(list, "id");
                setMembers(list);

                getSearchUsers(data?.keyword, courseId).then(list => {
                    sortDesc(list, "id");
                    setLoadOptions(list);
                }).catch((e) => {
                    setErrorMessage(e);
                    setShowError(true);
                }).finally(async () => {
                    await setShowLoader(false);
                })

            }).catch((e) => {
                setErrorMessage(e);
                setShowLoader(false);
                setShowError(true);
            })
        }).catch((e) => {
            setErrorMessage(e);
            setShowLoader(false);
            setShowError(true);
        })
    }

    const handleDeleteMember = (user_id) => {

    }

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h2>Dodaj członka</h2>
                <hr className="my-4"/>
            </div>
            <p>Wyszukaj użytkownika (wprowadź przynajmniej 3 znaki)</p>
            <input type="text" id="keyword" className="form-control third" name="keyword"
                   placeholder="Wpisz przynajmniej 3 znaki" value={data.keyword}
                   onChange={handleOnChange}/>


            {!isEmpty(loadOptions) && (
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
                    {loadOptions.map(({id, email, name, second_name, lastname, status}) => (
                        <tr key={id}>
                            <th scope="row">{id}</th>
                            <td>{name} {second_name}</td>
                            <td>{lastname}</td>
                            <td>{email}</td>
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
                                                className="badge bg-primary">{StatusUserName[StatusUser.STUDENT]}</span>
                                            </td>
                                        )
                            }
                            <td>
                                <td style={{textAlign: 'center'}}>
                                    <button type="button" className="btn btn-success"
                                            onClick={() => handleAddMember(courseId, id)}><FontAwesomeIcon
                                        icon={faUserPlus}/>
                                    </button>
                                </td>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h2>Lista członków</h2>
                <hr className="my-4"/>
            </div>

            {isEmpty(members) ? (<p>Brak</p>) : (
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
                                      is_author,
                                      is_author_or_member_of_one_of_parent,
                                      status
                                  }) => (

                        <tr key={id}>
                            <th scope="row">{id}</th>
                            <td>{name} {second_name}</td>
                            <td>{lastname}</td>
                            <td>{email}</td>
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
                                                className="badge bg-primary">{StatusUserName[StatusUser.STUDENT]}</span>
                                            </td>
                                        )
                            }
                            <td>{is_author === 1 ? (
                                <span className="badge bg-danger">Autor tego kursu</span>
                            ) : is_author_or_member_of_one_of_parent === 1 ? (
                                <span className="badge bg-danger">Członek lub autor jednego z kursów nadrzędnych</span>
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
            )}
            <SweetAlert
                error
                show={showError}
                title="Coś poszło nie tak :("
                confirmBtnText="Już poprawiam, Sir!"
                confirmBtnBsStyle="danger"
                onConfirm={() => setShowError(false)}
            >
                {errorMessage}
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default FormAddMember;