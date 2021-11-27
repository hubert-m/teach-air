import React, {useEffect, useState} from "react";
import {getSearchUsers, setUserStatus} from "../../helpers/User";
import ContainerGlobalSettings from "./ContainerGlobalSettings";
import {StatusUser, StatusUserName} from "../../constants/StatusUser";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGraduationCap, faCheckCircle, faCrown, faUser} from '@fortawesome/free-solid-svg-icons';
import LoaderScreen from "../../components/LoaderScreen";
import {isNull, size} from "lodash";
import {sortDesc} from "../../helpers/sort";

const Users = ({userData}) => {

    const [usersList, setUsersList] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [lengthKeywordWhenOneRecord, setLengthKeywordWhenOneRecord] = useState(null);
    const [data, setData] = useState({
        keyword: '',
    });

    useEffect( () => {
        setShowLoader(true);
        getSearchUsers().then(list => {
            sortDesc(list, "id");
            setUsersList(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }, [])

    const handleChangeStatus = (id, status) => {
        setShowLoader(true);
        setUserStatus(id, status).then(() => {
            getSearchUsers(data?.keyword).then(list => {
                sortDesc(list, "id");
                setUsersList(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }).catch(() => {
        })
    }

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))

        if (e.target.value.length >= 3) {

            if (size(usersList) === 1 && isNull(lengthKeywordWhenOneRecord)) {
                setLengthKeywordWhenOneRecord(e.target.value.length);
            }

            if (size(usersList) > 1) {
                setLengthKeywordWhenOneRecord(null);
            }

            if (e.target.value.length < lengthKeywordWhenOneRecord || isNull(lengthKeywordWhenOneRecord)) {
                setShowLoader(true);
                getSearchUsers(e.target.value).then(list => {
                    sortDesc(list, "id");
                    setUsersList(list);
                }).catch(() => {
                }).finally(async () => {
                    await setShowLoader(false);
                })
            }
        } else if (e.target.value.length === 0) {
            setShowLoader(true);
            getSearchUsers().then(list => {
                sortDesc(list, "id");
                setUsersList(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }
    }

    return (
        <ContainerGlobalSettings>
            <div className="jumbotron">
                <h1 className="display-7">Użytkownicy</h1>
                <hr className="my-4"/>
            </div>
            <p>Wyszukaj użytkownika (wprowadź przynajmniej 3 znaki) (skasuj wszystkie znaki aby pobrać pełną listę)</p>
            <input type="text" id="keyword" className="form-control third" name="keyword"
                   placeholder="Wpisz przynajmniej 3 znaki" value={data.keyword}
                   onChange={handleOnChange}/>
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
                    <tr key={id}>
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
                                            className="badge bg-primary">{StatusUserName[StatusUser.STUDENT]}</span>
                                        </td>
                                    )
                        }
                        {id !== userData?.id && status === StatusUser.UNACTIVATED ? (
                            <>
                                <td colSpan={2} style={{textAlign: 'center'}}>
                                    <button type="button" className="btn btn-success"
                                            onClick={() => handleChangeStatus(id, StatusUser.STUDENT)}><FontAwesomeIcon
                                        icon={faCheckCircle}/>
                                    </button>
                                </td>
                            </>
                        ) : id !== userData?.id && status === StatusUser.STUDENT ? (
                            <>
                                <td style={{textAlign: 'center'}}>
                                    <button type="button" className="btn btn-warning"
                                            onClick={() => handleChangeStatus(id, StatusUser.TEACHER)}><FontAwesomeIcon
                                        icon={faGraduationCap}/>
                                    </button>
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <button type="button" className="btn btn-danger"
                                            onClick={() => handleChangeStatus(id, StatusUser.ADMIN)}><FontAwesomeIcon
                                        icon={faCrown}/>
                                    </button>
                                </td>
                            </>
                        ) : id !== userData?.id && status === StatusUser.TEACHER ? (
                            <>
                                <td style={{textAlign: 'center'}}>
                                    <button type="button" className="btn btn-primary"
                                            onClick={() => handleChangeStatus(id, StatusUser.STUDENT)}><FontAwesomeIcon
                                        icon={faUser}/>
                                    </button>
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <button type="button" className="btn btn-danger"
                                            onClick={() => handleChangeStatus(id, StatusUser.ADMIN)}><FontAwesomeIcon
                                        icon={faCrown}/>
                                    </button>
                                </td>
                            </>
                        ) : id !== userData?.id && status === StatusUser.ADMIN ? (
                            <>
                                <td style={{textAlign: 'center'}}>
                                    <button type="button" className="btn btn-primary"
                                            onClick={() => handleChangeStatus(id, StatusUser.STUDENT)}><FontAwesomeIcon
                                        icon={faUser}/>
                                    </button>
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <button type="button" className="btn btn-warning"
                                            onClick={() => handleChangeStatus(id, StatusUser.TEACHER)}><FontAwesomeIcon
                                        icon={faGraduationCap}/>
                                    </button>
                                </td>
                            </>
                        ) : (
                            <td colSpan={2} style={{textAlign: 'center'}}><span
                                className="badge bg-success">Aktualnie zalogowany</span></td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            {showLoader && <LoaderScreen/>}
        </ContainerGlobalSettings>
    )

}

export default Users;