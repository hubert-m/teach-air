import React, {useEffect, useState} from 'react';
import {getSearchUsers, getSexList} from "../../helpers/User";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import Routes from "../../constants/Routes";
import {useHistory} from "react-router";
import {size, isNull, isEmpty} from "lodash";
import {StatusUser, StatusUserName} from "../../constants/StatusUser";
import LoaderScreen from "../../components/LoaderScreen";
import {getContacts} from "../../helpers/Message";
import {sortAsc, sortDesc} from "../../helpers/sort";
import {Twemoji} from 'react-emoji-render';
import {DefaultAvatarSrc} from "../../constants/DefaultAvatar";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

const MessagesList = () => {
    const history = useHistory();
    const [loadOptions, setLoadOptions] = useState([]);
    const [sexList, setSexList] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [lengthKeywordWhenOneRecord, setLengthKeywordWhenOneRecord] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    const [data, setData] = useState({
        keyword: '',
        status: '',
        sex: ''
    });

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
                getSearchUsers(e.target.value, "", data?.status, data?.sex).then(list => {
                    setLoadOptions(list);
                }).catch(() => {
                }).finally(async () => {
                    await setShowLoader(false);
                })
            }
        }
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
            getSearchUsers(data?.keyword, "", e.target.value, data?.sex).then(list => {
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
            getSearchUsers(data?.keyword, "", data?.status, e.target.value).then(list => {
                sortDesc(list, "id");
                setLoadOptions(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }
    }

    useEffect(() => {
        setShowLoader(true);
        getContacts().then(list => {
            sortDesc(list, "lastMessage", "id");
            setContacts(list);
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

    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <p>Do kogo chcesz napisać wiadomość? (wprowadź przynajmniej 3 znaki)</p>
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
                            <FormControlLabel value={StatusUser.UNACTIVATED} control={<Radio/>} label={<span
                                className="badge bg-secondary">{StatusUserName[StatusUser.UNACTIVATED]}</span>}/>
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
                            <th scope="col">&nbsp;</th>
                            <th scope="col">Imię</th>
                            <th scope="col">Nazwisko</th>
                            <th scope="col">Email</th>
                            <th scope="col">&nbsp;</th>
                            <th scope="col" style={{textAlign: 'center'}}>Napisz wiadomość</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loadOptions.map(({
                                              id,
                                              email,
                                              name,
                                              second_name,
                                              lastname,
                                              status,
                                              show_email,
                                              profile_image,
                                              sex_id
                                          }) => (
                            <tr key={id}>
                                <th scope="row">{id}</th>
                                <td>
                                    <div className="message-avatar">
                                        <img
                                            src={profile_image || DefaultAvatarSrc[sex_id?.id] || DefaultAvatarSrc[0]}
                                            alt=""/>
                                    </div>
                                </td>
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
                                <td style={{textAlign: 'center'}}>
                                    <button type="button" className="btn btn-info" style={{color: "#FFF"}}
                                            onClick={() => history.push(Routes.MESSAGES_WITH_USER + id)}>
                                        <FontAwesomeIcon
                                            icon={faEnvelope}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!isEmpty(contacts) && (
                <>
                    <div className="jumbotron" style={{marginTop: '50px'}}>
                        <h1 className="display-7">Aktywne konwersacje</h1>
                        <hr className="my-4"/>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">&nbsp;</th>
                                <th scope="col">Imię</th>
                                <th scope="col">Nazwisko</th>
                                <th scope="col">Email</th>
                                <th scope="col">&nbsp;</th>
                                <th scope="col" style={{textAlign: 'center'}}>Ostatnia wiadomość</th>
                                <th scope="col" style={{textAlign: 'center'}}>Napisz wiadomość</th>
                            </tr>
                            </thead>
                            <tbody>
                            {contacts.map(({
                                               id,
                                               email,
                                               name,
                                               second_name,
                                               lastname,
                                               status,
                                               lastMessage,
                                               show_email,
                                               profile_image,
                                               sex_id
                                           }) => (
                                <tr key={id}
                                    style={lastMessage?.sender_id == id && lastMessage?.is_read == 0 ? {backgroundColor: '#ffffb3'} : null}>
                                    <td>
                                        <div className="message-avatar">
                                            <img
                                                src={profile_image || DefaultAvatarSrc[sex_id] || DefaultAvatarSrc[0]}
                                                alt=""/>
                                        </div>
                                    </td>
                                    <td>{name} {second_name}</td>
                                    <td>{lastname}</td>
                                    <td>{show_email == "1" ? email : "(ukryty)"}</td>
                                    {status == StatusUser.ADMIN ?
                                        (
                                            <td><span
                                                className="badge bg-danger">{StatusUserName[StatusUser.ADMIN]}</span>
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
                                    <td style={{textAlign: 'center'}}>
                                        {lastMessage?.sender_id == id ? (
                                            <span
                                                className="badge bg-primary" style={{marginRight: '5px'}}>{name}</span>
                                        ) : (
                                            <span
                                                className="badge bg-secondary" style={{marginRight: '5px'}}>Ty:</span>
                                        )}
                                        <Twemoji text={(lastMessage?.content).substring(0,35)}/>...
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <button type="button" className="btn btn-info" style={{color: "#FFF"}}
                                                onClick={() => history.push(Routes.MESSAGES_WITH_USER + id)}>
                                            <FontAwesomeIcon
                                                icon={faEnvelope}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default MessagesList;