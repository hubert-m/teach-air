import React, {useEffect, useState} from 'react';
import {changePassword, getSexList, setProfileImage, updateMe} from "../../helpers/User";
import {Switch} from "@mui/material";
import parseTimeStamp from "../../helpers/parseTimeStamp";
import {StatusUser, StatusUserName} from "../../constants/StatusUser";
import replaceNull from "../../helpers/replaceNull";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../components/LoaderScreen";
import {isEmpty, isNull, size} from "lodash";
import SimpleReactLightbox, {SRLWrapper} from "simple-react-lightbox";
import {getSearchFiles} from "../../helpers/Files";
import {sortDesc} from "../../helpers/sort";
import ImageExtensions from "../../constants/ImageExtensions";
import UploadFile from "../Hosting/components/UploadFile";
import {DefaultAvatarSrc} from "../../constants/DefaultAvatar";
import Routes from "../../constants/Routes";
import {useHistory} from "react-router";
import {scoreWords, shortScoreWord} from "../../constants/scoreWords";
import PasswordStrengthBar from "react-password-strength-bar";

const Settings = ({userData, setUserData}) => {
    const history = useHistory();
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [data, setData] = useState({
        ...userData,
        sex_id: userData?.sex_id?.id
    });
    const [dataPassword, setDataPassword] = useState({
        old_password: '',
        new_password: '',
        new_password_repeat: ''
    });
    const [sexList, setSexList] = useState([]);

    const [lengthKeywordWhenOneRecord, setLengthKeywordWhenOneRecord] = useState(null);
    const [data_files, setData_files] = useState({
        keyword: '',
    });
    const [listOfFiles, setListOfFiles] = useState([]);

    useEffect(() => {
        getSexList().then(list => {
            setSexList(list);
        }).catch(() => {
        })

        setData(replaceNull(data));

        setShowLoader(true);
        getSearchFiles(data_files?.keyword, ImageExtensions).then(list => {
            sortDesc(list, "id");
            setListOfFiles(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }, [])

    const handleOnChange_files = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData_files((prevState) => ({
            ...prevState,
            ...result,
        }))

        if (e.target.value.length >= 3) {

            if (size(listOfFiles) == 1 && isNull(lengthKeywordWhenOneRecord)) {
                setLengthKeywordWhenOneRecord(e.target.value.length);
            }

            if (size(listOfFiles) > 1) {
                setLengthKeywordWhenOneRecord(null);
            }

            if (e.target.value.length < lengthKeywordWhenOneRecord || isNull(lengthKeywordWhenOneRecord)) {
                setShowLoader(true);
                getSearchFiles(e.target.value, ImageExtensions).then(list => {
                    sortDesc(list, "id");
                    setListOfFiles(list);
                }).catch(() => {
                }).finally(async () => {
                    await setShowLoader(false);
                })
            }
        } else if (e.target.value.length == 0) {
            setShowLoader(true);
            getSearchFiles(data_files?.keyword, ImageExtensions).then(list => {
                sortDesc(list, "id");
                setListOfFiles(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }
    }


    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleOnChangePassword = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setDataPassword((prevState) => ({
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

    const handleOnSubmitChangePassword = () => {
        setShowLoader(true);
        changePassword(dataPassword).then(() => {
            setSuccessMessage("Pomyślnie zmieniono hasło");
            setShowSuccess(true);
            setTimeout(() => {
                history.push(Routes.LOGOUT);
            }, 3000)
        }).catch((err) => {
            setErrorMessage(err);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleOnUpdate = () => {
        setShowLoader(true);
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

    const handleSetProfileImage = (url) => {
        setShowLoader(true);
        setProfileImage(url).then(() => {
            setUserData({
                ...data,
                sex_id: userData?.sex_id,
                profile_image: url
            });
        }).catch((err) => {
            setErrorMessage(err);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
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
                    {data?.status == StatusUser.ADMIN ?
                        (
                            <td><span className="badge bg-danger">{StatusUserName[StatusUser.ADMIN]}</span>
                            </td>
                        ) : data?.status == StatusUser.UNACTIVATED ?
                            (
                                <td><span
                                    className="badge bg-secondary">{StatusUserName[StatusUser.UNACTIVATED]}</span>
                                </td>
                            ) : data?.status == StatusUser.TEACHER ?
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
                <h1 className="display-7">Zmień haslo</h1>
                <hr className="my-4"/>
            </div>
            <div className="row">
                <div className="col-lg-4">
                    <label htmlFor="old_password">Stare hasło</label>
                    <input type="password" className="form-control" name="old_password"
                           placeholder="Stare hasło" value={dataPassword?.old_password}
                           onChange={handleOnChangePassword}/>
                </div>
                <div className="col-lg-4">
                    <label htmlFor="new_password">Nowe hasło</label>
                    <input type="password" className="form-control" name="new_password"
                           placeholder="Nowe hasło" value={dataPassword?.new_password}
                           onChange={handleOnChangePassword}/>
                    <PasswordStrengthBar password={dataPassword.new_password} scoreWords={scoreWords} shortScoreWord={shortScoreWord} minLength={8} />
                </div>
                <div className="col-lg-4">
                    <label htmlFor="new_password_repeat">Powtórz nowe hasło</label>
                    <input type="password" className="form-control" name="new_password_repeat"
                           placeholder="Powtórz nowe hasło" value={dataPassword?.new_password_repeat}
                           onChange={handleOnChangePassword}/>
                </div>
                <div className="col-lg-12">
                    <button style={{marginTop: '20px'}}
                            onClick={() => handleOnSubmitChangePassword()}>Zmień hasło
                    </button>
                </div>
            </div>


            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Upload zdjęcia profilowego</h1>
                <hr className="my-4"/>
            </div>
            <div className="row" style={{marginBottom: '25px'}}>
                <div className="col-lg-4 offset-lg-4">
                    <img src={data?.profile_image || DefaultAvatarSrc[data?.sex_id] || DefaultAvatarSrc[0]} alt=""
                         style={{maxWidth: '100%'}}/>
                </div>
            </div>
            {data?.profile_image != "" && (
                <div className="row" style={{marginBottom: '25px'}}>
                    <div className="col-lg-4 offset-lg-4">
                        <button type="button" className="btn btn-danger"
                                style={{color: "#FFF", marginLeft: "10px"}}
                                onClick={() => {
                                    handleSetProfileImage('')
                                }}>
                            Usuń zdjęcie profilowe
                        </button>
                    </div>
                </div>
            )}

            <UploadFile setMyFiles={setListOfFiles} keyword={data_files?.keyword} extensions={ImageExtensions} changeProfile={data?.id} setUserData={setUserData}/>
            <p style={{marginTop: '25px'}}>Wyszukaj zdjęcie (wprowadź przynajmniej 3 znaki) (skasuj wszystkie znaki aby
                pobrać pełną listę)</p>
            <input type="text" id="keyword" className="form-control third" name="keyword"
                   placeholder="Wpisz przynajmniej 3 znaki" value={data_files.keyword}
                   onChange={handleOnChange_files}/>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Nazwa pliku</th>
                        <th scope="col">Rozszerzenie</th>
                        <th scope="col">Rozmiar</th>
                        <th scope="col">Ustaw</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isEmpty(listOfFiles) ? (<tr>
                        <td colSpan={6}>Brak zdjęć</td>
                    </tr>) : listOfFiles?.map(({id, name, url, extension, size}) => (
                        <tr key={id}>
                            <td>
                                <SimpleReactLightbox>
                                    <SRLWrapper>
                                        <a href={url}><img src={url}
                                                           style={{maxWidth: '50px', height: 'auto'}}
                                                           alt=""/></a>
                                    </SRLWrapper>
                                </SimpleReactLightbox>
                                {name}.{extension}
                            </td>
                            <td>{extension}</td>
                            <td>{Math.ceil(size / 1024)}KB</td>
                            <td>
                                <button style={{marginTop: '20px'}}
                                        onClick={() => handleSetProfileImage(url)}>Ustaw profilowe
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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