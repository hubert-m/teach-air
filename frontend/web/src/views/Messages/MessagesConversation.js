import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router";
import {getMe, getUserById} from "../../helpers/User";
import LoaderScreen from "../../components/LoaderScreen";
import {getMessages, sendMessage} from "../../helpers/Message";
import parseTimeStamp from "../../helpers/parseTimeStamp";
import SweetAlert from "react-bootstrap-sweetalert";
import FontAwesome from 'react-fontawesome';
import {Twemoji} from 'react-emoji-render';
import {DefaultAvatarSrc} from "../../constants/DefaultAvatar";
import {getSearchFiles} from "../../helpers/Files";
import {sortDesc} from "../../helpers/sort";
import {
    Modal, ModalFooter,
    ModalHeader, ModalBody
} from "reactstrap";
import {isEmpty, isNull, size} from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import UploadFile from "../Hosting/components/UploadFile";
import useInterval from "../../helpers/useInterval";

const MessagesConversation = ({userData, setUserData}) => {
    let {id} = useParams();
    const [contact, setContact] = useState({});
    const [messages, setMessages] = useState([]);
    const [showError, setShowError] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const messagesEndRef = useRef(null)
    const [data, setData] = useState({
        message: '',
        recipient_id: id,
        files: []
    });
    const [lengthKeywordWhenOneRecord, setLengthKeywordWhenOneRecord] = useState(null);
    const [data_files, setData_files] = useState({
        keyword: '',
    });
    const [listOfFiles, setListOfFiles] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);


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
                getSearchFiles(e.target.value).then(list => {
                    sortDesc(list, "id");
                    setListOfFiles(list);
                }).catch(() => {
                }).finally(async () => {
                    await setShowLoader(false);
                })
            }
        } else if (e.target.value.length == 0) {
            setShowLoader(true);
            getSearchFiles().then(list => {
                sortDesc(list, "id");
                setListOfFiles(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }
    }


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    useInterval(() => {
        getMessages(id).then(list => {
            setMessages(list);
        }).catch(() => {
        })
    }, 5000)

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleSendMessage = () => {
        setShowLoader(true);
        sendMessage(data).then(() => {

            setData((prevState) => ({
                ...prevState,
                message: '',
                files: []
            }))

            getMessages(id).then(list => {
                setMessages(list);
            }).catch(() => {
            })
        }).catch((e) => {
            setErrorMessage(e);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    useEffect(() => {
        setShowLoader(true);
        getUserById(id).then(data => {
            setContact(data);

            getMessages(id).then(list => {
                setMessages(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })

        }).catch(() => {
        })

        // przy wyjsciu ze strony
        return function cleanup() {
            getMe().then(userDataTmp => {
                setUserData(userDataTmp);
                //console.log(userDataTmp);
            }).catch(() => {})
        }

    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const handleKeyPress = event => {
        if (event.key == 'Enter') {
            handleSendMessage();
        }
    };

    const handleAddFiles = () => {
        setShowLoader(true);
        getSearchFiles(data_files?.keyword).then(list => {
            sortDesc(list, "id");
            setListOfFiles(list);
            setModalIsOpen(true);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handlePushFileToArr = (file) => {
        data?.files.push(file)
        setData((prevState) => ({
            ...prevState,
            files: data?.files,
        }))
    }

    const handleDeleteFileFromArray = (fileId) => {
        const newList = data?.files?.filter((item) => item.id !== fileId);
        setData((prevState) => ({
            ...prevState,
            files: newList,
        }))
    }

    const isFileAddedToArray = (file) => {
        return data?.files?.find((item) => {
                return item.id == file?.id
            }
        );
    }

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <img className="message-avatar-big"
                     src={contact?.profile_image || DefaultAvatarSrc[contact?.sex_id?.id] || DefaultAvatarSrc[0]}
                     alt=""/>
                <h1 className="display-7 title-of-message">Rozmowa
                    z {contact?.name} {contact?.second_name} {contact?.lastname}</h1>
                <hr className="my-4"/>
            </div>
            <div style={{maxHeight: 370, overflowY: 'auto', overflowX: 'hidden', whiteSpace: 'nowrap'}}>
                {messages.map(({id, content, sender_id, created_at, is_read, files}) => (
                    <React.Fragment key={id}>
                        {sender_id == userData?.id ? (
                            <div className="message-my">
                                <span className="time">{parseTimeStamp(created_at)}</span>
                                <span className="badge bg-primary"><Twemoji text={content}/></span>
                                <div className="message-avatar message-avatar-my">
                                    <img
                                        src={userData?.profile_image || DefaultAvatarSrc[userData?.sex_id?.id] || DefaultAvatarSrc[0]}
                                        alt=""/>
                                </div>
                                {is_read == 1 && (
                                    <p className="is-read"><FontAwesome
                                        className='super-crazy-colors'
                                        name='check'
                                        size='1x'
                                        style={{textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)'}}
                                    />Wiadomość przeczytana</p>
                                )}
                                {!isEmpty(files) && (
                                    <div className="files-under-message-container">
                                        {files.map(({id, name, url, extension}) => (
                                            <a href={url} key={id} className="file-under-message">{name}.{extension}</a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="message-contact">
                                <div className="message-avatar message-avatar-contact">
                                    <img
                                        src={contact?.profile_image || DefaultAvatarSrc[contact?.sex_id?.id] || DefaultAvatarSrc[0]}
                                        alt=""/>
                                </div>
                                <span className="badge bg-secondary"><Twemoji text={content}/></span>
                                <span className="time">{parseTimeStamp(created_at)}</span>
                                {!isEmpty(files) && (
                                    <div className="files-under-message-container">
                                        {files.map(({id, name, url, extension}) => (
                                            <a href={url} key={id} className="file-under-message">{name}.{extension}</a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </React.Fragment>
                ))}
                <div ref={messagesEndRef}/>
            </div>
            <div className="row">
                <div className="col-lg-6 offset-lg-3">
                    <textarea
                        className="form-control"
                        placeholder="Treść wiadomości"
                        rows="5"
                        name="message"
                        style={{marginTop: '20px'}}
                        value={data.message}
                        onKeyPress={handleKeyPress}
                        onChange={handleOnChange}/>
                </div>
                {!isEmpty(data?.files) && (
                    <div className="col-lg-6 offset-lg-3">
                        <p>Dodane pliki (kliknij aby usunąć):</p>
                        {data?.files?.map(({id, name, extension}) => (
                                <span key={id} className="added-file"
                                      onClick={() => handleDeleteFileFromArray(id)}>{name}.{extension}</span>
                            )
                        )}
                    </div>
                )}
                <div className="col-lg-3 offset-lg-3">
                    <button style={{marginTop: '20px'}}
                            onClick={() => handleAddFiles()}>Dołącz pliki do wiadomości
                    </button>
                </div>
                <div className="col-lg-3">
                    <button style={{marginTop: '20px'}}
                            onClick={() => handleSendMessage()}>Wyślij
                        wiadomość
                    </button>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                toggle={() => setModalIsOpen(!modalIsOpen)}
                className="modal-lg"
            >
                <ModalHeader>Pliki</ModalHeader>
                <ModalBody>
                    <UploadFile setMyFiles={setListOfFiles} attachFile={true} handlePushFileToArr={handlePushFileToArr}
                                keyword={data_files?.keyword}/>
                    <p style={{marginTop: '25px'}}>Wyszukaj plik (wprowadź przynajmniej 3 znaki) (skasuj wszystkie znaki
                        aby pobrać pełną listę)</p>
                    <input type="text" id="keyword" className="form-control third" name="keyword"
                           placeholder="Wpisz przynajmniej 3 znaki" value={data_files.keyword}
                           onChange={handleOnChange_files}/>
                    <div className="table-responsive">
                        <table className="table" style={{marginTop: '25px'}}>
                            <thead>
                            <tr>
                                <th scope="col">Nazwa pliku</th>
                                <th scope="col">Rozszerzenie</th>
                                <th scope="col">Rozmiar</th>
                                <th scope="col">Dołącz</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isEmpty(listOfFiles) ? (<tr>
                                <td colSpan={4}>Brak plikow</td>
                            </tr>) : listOfFiles?.map((props) => {
                                const {id, name, url, extension, size} = props;
                                return (
                                    <tr key={id}>
                                        <td>
                                            <a href={url}>{name}.{extension}</a>
                                        </td>
                                        <td>{extension}</td>
                                        <td>{Math.ceil(size / 1024)}KB</td>
                                        <td>
                                            {isFileAddedToArray(props) ? (
                                                <button type="button" className="btn btn-danger"
                                                        onClick={() => handleDeleteFileFromArray(id)}>
                                                    <FontAwesomeIcon
                                                        icon={faMinus}/>
                                                </button>
                                            ) : (
                                                <button type="button" className="btn btn-success"
                                                        onClick={() => handlePushFileToArr(props)}><FontAwesomeIcon
                                                    icon={faPlus}/>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-success"
                            onClick={() => setModalIsOpen(false)}>Gotowe
                    </button>
                </ModalFooter>
            </Modal>
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

export default MessagesConversation;