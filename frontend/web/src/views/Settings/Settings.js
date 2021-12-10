import React, {useEffect, useState} from 'react';
import {getMe, getSexList, updateMe} from "../../helpers/User";
import {Switch} from "@mui/material";
import parseTimeStamp from "../../helpers/parseTimeStamp";
import {StatusUser, StatusUserName} from "../../constants/StatusUser";
import replaceNull from "../../helpers/replaceNull";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../components/LoaderScreen";

const Settings = ({userData, setUserData}) => {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [data, setData] = useState({
        ...userData,
        sex_id: userData?.sex_id?.id
    });
    const [sexList, setSexList] = useState([]);

    useEffect(() => {
        getSexList().then(list => {
            setSexList(list);
        }).catch(() => {
        })

        setData(replaceNull(data));
    }, [])

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleOnChangeSwitch = (e) => {
        const result = {};
        result[e.target.name] = e.target.checked ? 1 : 0;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleOnUpdate = () => {
        setShowLoader(true);
        console.log(data);
        updateMe(data).then((res) => {
            setUserData(res?.auth);
        }).catch((err) => {
            setErrorMessage(err);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleOnReset = () => {
        setData(replaceNull({
            ...userData,
            sex_id: userData?.sex_id?.id
        }));
    }

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Edycja profilu</h1>
                <hr className="my-4"/>
            </div>
            <div className="row">
                <div className="col-lg-3">
                    <p><strong>Data rejestracji:</strong> {parseTimeStamp(data?.created_at)}</p>
                </div>
                <div className="col-lg-3">
                    <p><strong>Ostatnia modyfikacja profilu:</strong> {parseTimeStamp(data?.updated_at)}</p>
                </div>
                <div className="col-lg-3">
                    <p><strong>Ostatnia zmiana hasła:</strong> {parseTimeStamp(data?.last_change_pass)}</p>
                </div>
                <div className="col-lg-3">
                    {data?.status === StatusUser.ADMIN ?
                        (
                            <td><span className="badge bg-danger">{StatusUserName[StatusUser.ADMIN]}</span>
                            </td>
                        ) : data?.status === StatusUser.UNACTIVATED ?
                            (
                                <td><span
                                    className="badge bg-secondary">{StatusUserName[StatusUser.UNACTIVATED]}</span>
                                </td>
                            ) : data?.status === StatusUser.TEACHER ?
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
                </div>
                <div className="col-lg-12">
                    <hr/>
                </div>
                <div className="col-lg-6">
                    <label for="email">Adres E-mail</label>
                    <input type="email" className="form-control" name="email"
                           placeholder="E-mail" aria-describedby="emailHelp" value={data?.email} disabled/>
                </div>
                <div className="col-lg-3">
                    <label htmlFor="id">Identyfikator</label>
                    <input type="text" className="form-control" name="id"
                           placeholder="ID" value={data?.id} disabled/>
                </div>
                <div className="col-lg-3">
                    <label htmlFor="show_email">Publiczny adres e-mail</label>
                    <Switch
                        checked={data?.show_email}
                        onChange={handleOnChangeSwitch}
                        inputProps={{'name': 'show_email'}}
                    />
                </div>
                <div className="col-lg-4">
                    <label htmlFor="email">Imię</label>
                    <input type="text" className="form-control" name="name"
                           placeholder="Imię" value={data?.name}
                           onChange={handleOnChange}/>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="email">Drugie imię</label>
                    <input type="text" className="form-control" name="second_name"
                           placeholder="Drugie imię" value={data?.second_name}
                           onChange={handleOnChange}/>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="email">Nazwisko</label>
                    <input type="text" className="form-control" name="lastname"
                           placeholder="Nazwisko" value={data?.lastname}
                           onChange={handleOnChange}/>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="sex_id">Płeć</label>
                    <select name="sex_id" onChange={handleOnChange} value={data?.sex_id}>
                        {sexList?.map(({id, value}) => (
                            <option value={id} key={id}>{value}</option>
                        ))}
                    </select>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="phone">Nr telefonu</label>
                    <input type="text" className="form-control" name="phone"
                           placeholder="Nr telefonu" value={data?.phone}
                           onChange={handleOnChange}/>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="facebook">Facebook</label>
                    <input type="text" className="form-control" name="facebook"
                           placeholder="Link do facebooka" value={data?.facebook}
                           onChange={handleOnChange}/>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="description">Opis profilu</label>
                    <textarea
                        className="form-control"
                        placeholder="Opis profilu"
                        rows="5"
                        name="description"
                        value={data?.description}
                        onChange={handleOnChange}/>
                </div>
                <div className="col-lg-6">
                    <label htmlFor="hobby">Hobby</label>
                    <textarea
                        className="form-control"
                        placeholder="Hobby"
                        rows="5"
                        name="hobby"
                        value={data?.hobby}
                        onChange={handleOnChange}/>
                </div>
                <div className="col-lg-6">
                    <button style={{marginTop: '20px'}}
                            onClick={() => handleOnUpdate()}>Zaktualizuj
                    </button>
                </div>
                <div className="col-lg-6">
                    <button style={{marginTop: '20px'}}
                            onClick={() => handleOnReset()}>Cofnij zmiany
                    </button>
                </div>
            </div>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Upload zdjęcia profilowego</h1>
                <hr className="my-4"/>
            </div>

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
            <SweetAlert
                success
                show={showSuccess}
                title="Hurraaa :)"
                onConfirm={() => setShowSuccess(false)}
            >
                {successMessage}
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default Settings;