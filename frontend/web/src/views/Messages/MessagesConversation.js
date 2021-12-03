import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router";
import {getUserById} from "../../helpers/User";
import LoaderScreen from "../../components/LoaderScreen";
import {getMessages, sendMessage} from "../../helpers/Message";
import parseTimeStamp from "../../helpers/parseTimeStamp";
import SweetAlert from "react-bootstrap-sweetalert";
import FontAwesome from 'react-fontawesome';
import {Twemoji} from 'react-emoji-render';
import {DefaultAvatarSrc} from "../../constants/DefaultAvatar";

const MessagesConversation = ({userData}) => {
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
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    const funcUpdateMessage = () => {
        getMessages(id).then(list => {
            setMessages(list);
        }).catch(() => {
        })
    }

    // uruchamia się nawet na innych routach i po przelogowaniu TODO naprawić
    //const [updateMessages] = useState(new cron.CronJob("*/5 * * * * *",async ()=>{
    //await funcUpdateMessage();
    //}));


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
                message: ''
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

        // TODO
        // updateMessages.start();
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <img className="message-avatar-big"
                    src={contact?.profile_image || DefaultAvatarSrc[contact?.sex_id?.id] || DefaultAvatarSrc[0]}
                    alt=""/>
                <h1 className="display-7 title-of-message">Rozmowa z {contact?.name} {contact?.second_name} {contact?.lastname}</h1>
                <hr className="my-4"/>
            </div>
            <div style={{maxHeight: 370, overflowY: 'auto', overflowX: 'hidden', whiteSpace: 'nowrap'}}>
                {messages.map(({id, content, sender_id, created_at, is_read}) => (
                    <React.Fragment key={id}>
                        {sender_id === userData?.id ? (
                            <div className="message-my">
                                <span className="time">{parseTimeStamp(created_at)}</span>
                                <span className="badge bg-primary"><Twemoji text={content}/></span>
                                <div className="message-avatar message-avatar-my">
                                    <img
                                        src={userData?.profile_image || DefaultAvatarSrc[userData?.sex_id?.id] || DefaultAvatarSrc[0]}
                                        alt=""/>
                                </div>
                                {is_read === 1 && (
                                    <p className="is-read"><FontAwesome
                                        className='super-crazy-colors'
                                        name='check'
                                        size='1x'
                                        style={{textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)'}}
                                    />Wiadomość przeczytana</p>
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
                <div className="col-lg-6 offset-lg-3">
                    <button style={{marginTop: '20px'}}
                            onClick={() => handleSendMessage()}>Wyślij
                        wiadomość
                    </button>
                </div>
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
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default MessagesConversation;