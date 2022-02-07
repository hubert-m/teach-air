import React, {useEffect, useState} from "react";
import {isEmpty, isNull, size} from "lodash";
import {getSearchUsers, getSexList} from "../../../helpers/User";
import LoaderScreen from "../../../components/LoaderScreen";
import {StatusUser, StatusUserName} from "../../../constants/StatusUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {sortAsc, sortDesc} from "../../../helpers/sort";
import {addMember, deleteMember, getMembersOfCourse} from "../../../helpers/Course";
import SweetAlert from "react-bootstrap-sweetalert";
import ListOfMembers from "./ListOfMembers";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

const FormAddMember = ({courseId}) => {
    const [loadOptions, setLoadOptions] = useState([]);
    const [members, setMembers] = useState([]);
    const [lengthKeywordWhenOneRecord, setLengthKeywordWhenOneRecord] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showError, setShowError] = useState(false);
    const [data, setData] = useState({
        keyword: '',
        status: '',
        sex: ''
    });
    const [sexList, setSexList] = useState([]);

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

        getSexList().then(list => {
            sortAsc(list, "id");
            setSexList(list);
        }).catch(() => {
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

            if (size(loadOptions) == 1 && isNull(lengthKeywordWhenOneRecord)) {
                setLengthKeywordWhenOneRecord(e.target.value.length);
            }

            if (size(loadOptions) > 1) {
                setLengthKeywordWhenOneRecord(null);
            }

            if (e.target.value.length < lengthKeywordWhenOneRecord || isNull(lengthKeywordWhenOneRecord)) {
                setShowLoader(true);
                getSearchUsers(e.target.value, courseId, data?.status, data?.sex).then(list => {
                    sortDesc(list, "id");
                    setLoadOptions(list);
                }).catch(() => {
                }).finally(async () => {
                    await setShowLoader(false);
                })
            }
        } else if (e.target.value.length == 0) {
            setLoadOptions([]);
        }
    }

    const handleAddMember = (user_id) => {
        setShowLoader(true);
        addMember(courseId, user_id).then(() => {
            getMembersOfCourse(courseId).then(list => {
                sortDesc(list, "id");
                setMembers(list);

                getSearchUsers(data?.keyword, courseId, data?.status, data?.sex).then(list => {
                    sortDesc(list, "id");
                    setLoadOptions(list);
                }).catch((e) => {
                    setErrorMessage(e);
                    setShowError(true);
                }).finally(async () => {
                    await setShowLoader(false);
                })

            }).catch((e) => {
                setShowLoader(false);
                setErrorMessage(e);
                setShowLoader(false);
                setShowError(true);
            })
        }).catch((e) => {
            setShowLoader(false);
            setErrorMessage(e);
            setShowLoader(false);
            setShowError(true);
        })
    }

    const handleDeleteMember = (user_id) => {
        setShowLoader(true);
        deleteMember(courseId, user_id).then(() => {
            getMembersOfCourse(courseId).then(list => {
                sortDesc(list, "id");
                setMembers(list);

                getSearchUsers(data?.keyword, courseId, data?.status, data?.sex).then(list => {
                    sortDesc(list, "id");
                    setLoadOptions(list);
                }).catch((e) => {
                    setErrorMessage(e);
                    setShowError(true);
                }).finally(async () => {
                    await setShowLoader(false);
                })

            }).catch((e) => {
                setShowLoader(false);
                setErrorMessage(e);
                setShowLoader(false);
                setShowError(true);
            })
        }).catch((e) => {
            setShowLoader(false);
            setErrorMessage(e);
            setShowLoader(false);
            setShowError(true);
        })
    }

    const handleOnChangeRadioStatus = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))

        if(e.target.value == "" && data?.keyword == "" && data?.sex == "") {
            setLoadOptions([])
        } else {
            setShowLoader(true);
            getSearchUsers(data?.keyword, courseId, e.target.value, data?.sex).then(list => {
                sortDesc(list, "id");
                setLoadOptions(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }
    }

    const handleOnChangeRadioSex = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))

        if(e.target.value == "" && data?.status == "" && data?.keyword == "") {
            setLoadOptions([])
        } else {

            setShowLoader(true);
            getSearchUsers(data?.keyword, courseId, data?.status, e.target.value).then(list => {
                sortDesc(list, "id");
                setLoadOptions(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }
    }

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h2>Dodaj członka</h2>
                <hr className="my-4"/>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <p>Wyszukaj użytkownika (wprowadź przynajmniej 3 znaki)</p>
                    <input type="text" id="keyword" className="form-control third" name="keyword"
                           placeholder="Wpisz przynajmniej 3 znaki" value={data.keyword}
                           onChange={handleOnChange}/>
                </div>

                <div className="col-lg-6" style={{paddingTop: '20px', paddingBottom: '20px'}}>
                    <FormControl>
                        <FormLabel id="row-radio-buttons-group-label">Wybierz status</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="row-radio-buttons-group-label"
                            name="status"
                            onChange={handleOnChangeRadioStatus}
                        >
                            <FormControlLabel value="" control={<Radio/>} label={
                                <span className="badge bg-light"
                                      style={{color: '#000', border: '1px solid #000'}}>Wszyscy</span>}
                                              checked={data?.status == ''}/>
                            <FormControlLabel value={StatusUser.STUDENT} control={<Radio/>} label={<span
                                className="badge bg-primary">{StatusUserName[StatusUser.STUDENT]}</span>}/>
                            <FormControlLabel value={StatusUser.TEACHER} control={<Radio/>} label={<span
                                className="badge bg-warning">{StatusUserName[StatusUser.TEACHER]}</span>}/>
                            <FormControlLabel value={StatusUser.ADMIN} control={<Radio/>} label={<span
                                className="badge bg-danger">{StatusUserName[StatusUser.ADMIN]}</span>}/>
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className="col-lg-6" style={{paddingTop: '20px', paddingBottom: '20px'}}>
                    <FormControl>
                        <FormLabel id="row-radio-buttons-group-label">Wybierz płeć</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="row-radio-buttons-group-label"
                            name="sex"
                            onChange={handleOnChangeRadioSex}
                        >
                            <FormControlLabel value="" control={<Radio/>}
                                              label={<span className="badge bg-info">Wszystkie</span>}
                                              checked={data?.sex == ''}/>
                            {sexList.map(({id, value}) => (
                                <FormControlLabel key={id} value={id} control={<Radio/>}
                                                  label={<span className="badge bg-info">{value}</span>}/>
                            ))}
                        </RadioGroup>
                    </FormControl>
                </div>
            </div>

            {!isEmpty(loadOptions) && (
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
                        {loadOptions.map(({id, email, name, second_name, lastname, status}) => (
                            <tr key={id}>
                                <th scope="row">{id}</th>
                                <td>{name} {second_name}</td>
                                <td>{lastname}</td>
                                <td>{email}</td>
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
                                <td>
                                    <td style={{textAlign: 'center'}}>
                                        <button type="button" className="btn btn-success"
                                                onClick={() => handleAddMember(id)}><FontAwesomeIcon
                                            icon={faUserPlus}/>
                                        </button>
                                    </td>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ListOfMembers members={members} handleDeleteMember={handleDeleteMember}/>

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