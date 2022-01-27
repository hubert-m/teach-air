import React, {useState} from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../components/LoaderScreen";
import {activateAccount, sendActivationAgain} from "../../helpers/User";

const ActivationMain = () => {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);


    const [dataSendAgain, setDataSendAgain] = useState({
        email: ''
    });
    const [dataActive, setDataActive] = useState({
        activate_token: ''
    });

    const handleOnChangeSendAgain = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setDataSendAgain((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleOnChangeActive = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setDataActive((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleSendAgain = () => {
        setShowLoader(true);
        sendActivationAgain(dataSendAgain).then(res => {
            setSuccessMessage(res.success);
            setShowSuccess(true);
        }).catch((error) => {
            setErrorMessage(error);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleActive = () => {
        setShowLoader(true);
        activateAccount(dataActive).then(res => {
            setSuccessMessage(res.success);
            setShowSuccess(true);
        }).catch((error) => {
            setErrorMessage(error);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleKeyPressSendActivate = event => {
        if (event.key == 'Enter') {
            handleSendAgain();
        }
    };

    const handleKeyPressActivate = event => {
        if (event.key == 'Enter') {
            handleActive();
        }
    };

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Aktywacja konta</h1>
                <hr className="my-4"/>
                <p>Nie dostałeś maila z linkiem aktywacyjnym? Nie ma go nawet w spamie? Wyślij ponownie link
                    aktywacyjny</p>
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <input type="email" id="email" className="form-control" name="email"
                           placeholder="E-mail" aria-describedby="emailHelp" value={dataSendAgain.email}
                           onChange={handleOnChangeSendAgain} onKeyPress={handleKeyPressSendActivate} />
                </div>
                <div className="col-lg-6">
                    <button style={{margin: '15px auto 25px auto'}}
                            onClick={() => handleSendAgain()}>Wyślij ponownie maila z linkiem aktywacyjnym
                    </button>
                </div>
            </div>
            <hr/>
            <p>Link aktywacyjny nie działa? Wpisz tutaj swój kod aktywacyjny, który otrzymałeś na maila</p>
            <div className="row">
                <div className="col-lg-6">
                    <input type="text" className="form-control" name="activate_token"
                           placeholder="Kod aktywacyjny" value={dataActive.activate_token}
                           onChange={handleOnChangeActive} onKeyPress={handleKeyPressActivate} />
                </div>
                <div className="col-lg-6">
                    <button style={{margin: '15px auto 25px auto'}}
                            onClick={() => handleActive()}>Aktywuj
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

export default ActivationMain;