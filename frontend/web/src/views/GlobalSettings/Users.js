import React, {useEffect, useState} from "react";
import {getSearchUsers, getSexList, setUserStatus} from "../../helpers/User";
import ContainerGlobalSettings from "./ContainerGlobalSettings";
import {StatusUser, StatusUserName} from "../../constants/StatusUser";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGraduationCap, faCheckCircle, faCrown, faUser} from '@fortawesome/free-solid-svg-icons';
import LoaderScreen from "../../components/LoaderScreen";
import {isNull, size} from "lodash";
import {sortAsc, sortDesc} from "../../helpers/sort";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Users = ({userData}) => {

    const [usersList, setUsersList] = useState([]);
    const [sexList, setSexList] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [lengthKeywordWhenOneRecord, setLengthKeywordWhenOneRecord] = useState(null);
    const [data, setData] = useState({
        keyword: '',
        status: '',
        sex: ''
    });

    useEffect(() => {
        setShowLoader(true);
        getSearchUsers().then(list => {
            sortDesc(list, "id");
            setUsersList(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })

        getSexList().then(list => {
            sortAsc(list, "id");
            setSexList(list);
        }).catch(() => {
        })
    }, [])

    const handleChangeStatus = (id, status) => {
        setShowLoader(true);
        setUserStatus(id, status).then(() => {
            getSearchUsers(data?.keyword, "", data?.status, data?.sex).then(list => {
                sortDesc(list, "id");
                setUsersList(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }).catch(() => {
        })
    }

    const handleOnChangeRadioStatus = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
        setShowLoader(true);
        getSearchUsers(data?.keyword, "", e.target.value, data?.sex).then(list => {
            sortDesc(list, "id");
            setUsersList(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleOnChangeRadioSex = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
        setShowLoader(true);
        getSearchUsers(data?.keyword, "", data?.status, e.target.value).then(list => {
            sortDesc(list, "id");
            setUsersList(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
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

            if (size(usersList) == 1 && isNull(lengthKeywordWhenOneRecord)) {
                setLengthKeywordWhenOneRecord(e.target.value.length);
            }

            if (size(usersList) > 1) {
                setLengthKeywordWhenOneRecord(null);
            }

            if (e.target.value.length < lengthKeywordWhenOneRecord || isNull(lengthKeywordWhenOneRecord)) {
                setShowLoader(true);
                getSearchUsers(e.target.value, "", data?.status, data?.sex).then(list => {
                    sortDesc(list, "id");
                    setUsersList(list);
                }).catch(() => {
                }).finally(async () => {
                    await setShowLoader(false);
                })
            }
        } else if (e.target.value.length == 0) {
            setShowLoader(true);
            getSearchUsers("", "", data?.status, data?.sex).then(list => {
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
            <div className="row">
                <div className="col-lg-12">
                    <p>Wyszukaj użytkownika (wprowadź przynajmniej 3 znaki) (skasuj wszystkie znaki aby pobrać pełną listę)</p>
                    <input type="text" id="keyword" className="form-control third" name="keyword"
                           placeholder="Wpisz przynajmniej 3 znaki" value={data.keyword}
                           onChange={handleOnChange}/>
                </div>
                <div className="col-lg-6" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                    <FormControl>
                        <FormLabel id="row-radio-buttons-group-label">Wybierz status</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="row-radio-buttons-group-label"
                            name="status"
                            onChange={handleOnChangeRadioStatus}
                        >
                            <FormControlLabel value="" control={<Radio />} label={
                                <span className="badge bg-light" style={{ color: '#000', border: '1px solid #000' }}>Wszyscy</span>}
                                              checked={data?.status == ''} />
                            <FormControlLabel value={StatusUser.UNACTIVATED} control={<Radio />} label={<span className="badge bg-secondary">{StatusUserName[StatusUser.UNACTIVATED]}</span>} />
                            <FormControlLabel value={StatusUser.STUDENT} control={<Radio />} label={<span className="badge bg-primary">{StatusUserName[StatusUser.STUDENT]}</span>} />
                            <FormControlLabel value={StatusUser.TEACHER} control={<Radio />} label={<span className="badge bg-warning">{StatusUserName[StatusUser.TEACHER]}</span>} />
                            <FormControlLabel value={StatusUser.ADMIN} control={<Radio />} label={<span className="badge bg-danger">{StatusUserName[StatusUser.ADMIN]}</span>} />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className="col-lg-6" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                    <FormControl>
                        <FormLabel id="row-radio-buttons-group-label">Wybierz płeć</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="row-radio-buttons-group-label"
                            name="sex"
                            onChange={handleOnChangeRadioSex}
                        >
                            <FormControlLabel value="" control={<Radio />} label={<span className="badge bg-info">Wszystkie</span>} checked={data?.sex == ''} />
                            {sexList.map(({id, value}) => (
                            <FormControlLabel key={id} value={id} control={<Radio />} label={<span className="badge bg-info">{value}</span>} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </div>
            </div>
            <div className="table-responsive">
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
                            {id != userData?.id && status == StatusUser.UNACTIVATED ? (
                                <>
                                    <td colSpan={2} style={{textAlign: 'center'}}>
                                        <button type="button" className="btn btn-success"
                                                onClick={() => handleChangeStatus(id, StatusUser.STUDENT)}>
                                            <FontAwesomeIcon
                                                icon={faCheckCircle}/>
                                        </button>
                                    </td>
                                </>
                            ) : id != userData?.id && status == StatusUser.STUDENT ? (
                                <>
                                    <td style={{textAlign: 'center'}}>
                                        <button type="button" className="btn btn-warning"
                                                onClick={() => handleChangeStatus(id, StatusUser.TEACHER)}>
                                            <FontAwesomeIcon
                                                icon={faGraduationCap}/>
                                        </button>
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <button type="button" className="btn btn-danger"
                                                onClick={() => handleChangeStatus(id, StatusUser.ADMIN)}>
                                            <FontAwesomeIcon
                                                icon={faCrown}/>
                                        </button>
                                    </td>
                                </>
                            ) : id != userData?.id && status == StatusUser.TEACHER ? (
                                <>
                                    <td style={{textAlign: 'center'}}>
                                        <button type="button" className="btn btn-primary"
                                                onClick={() => handleChangeStatus(id, StatusUser.STUDENT)}>
                                            <FontAwesomeIcon
                                                icon={faUser}/>
                                        </button>
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <button type="button" className="btn btn-danger"
                                                onClick={() => handleChangeStatus(id, StatusUser.ADMIN)}>
                                            <FontAwesomeIcon
                                                icon={faCrown}/>
                                        </button>
                                    </td>
                                </>
                            ) : id != userData?.id && status == StatusUser.ADMIN ? (
                                <>
                                    <td style={{textAlign: 'center'}}>
                                        <button type="button" className="btn btn-primary"
                                                onClick={() => handleChangeStatus(id, StatusUser.STUDENT)}>
                                            <FontAwesomeIcon
                                                icon={faUser}/>
                                        </button>
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <button type="button" className="btn btn-warning"
                                                onClick={() => handleChangeStatus(id, StatusUser.TEACHER)}>
                                            <FontAwesomeIcon
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
            </div>
            {showLoader && <LoaderScreen/>}
        </ContainerGlobalSettings>
    )

}

export default Users;