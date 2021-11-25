import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {getSexList, getUserById} from "../../helpers/User";
import LoaderScreen from "../../components/LoaderScreen";
import {getMessages, sendMessage} from "../../helpers/Message";
import parseTimeStamp from "../../helpers/parseTimeStamp";
import SweetAlert from "react-bootstrap-sweetalert";

const MessagesConversation = ({userData}) => {
    let {id} = useParams();
    const [contact, setContact] = useState({});
    const [messages, setMessages] = useState([]);
    const [showError, setShowError] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [data, setData] = useState({
        message: '',
        recipient_id: id,
    });

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
    }, [])

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Rozmowa z {contact?.name} {contact?.second_name} {contact?.lastname}</h1>
                <hr className="my-4"/>
            </div>
            {messages.map(({content, sender_id, created_at}) => (
                <>
                    {sender_id === userData?.id ? (
                        <div className="message-my">
                            <span className="time">{parseTimeStamp(created_at)}</span>
                            <span className="badge bg-primary">{content}</span>
                        </div>
                    ) : (
                        <div className="message-contact">
                            <span className="badge bg-secondary">{content}</span>
                            <span className="time">{parseTimeStamp(created_at)}</span>
                        </div>
                    )}
                </>
            ))}
            <div className="row">
                <div className="col-lg-6 offset-lg-3">
                    <textarea
                        className="form-control"
                        placeholder="Treść wiadomości"
                        rows="5"
                        name="message"
                        style={{ marginTop: '20px' }}
                        value={data.message}
                        onKeyPress={handleKeyPress}
                        onChange={handleOnChange}/>
                </div>
                <div className="col-lg-6 offset-lg-3">
                    <button className="fourth" style={{ marginTop: '20px' }} onClick={() => handleSendMessage()}>Wyślij wiadomość
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