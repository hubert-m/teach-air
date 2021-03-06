import React, {useState} from "react";
import {resetPassword, sendResetPassword} from "../../helpers/User";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../components/LoaderScreen";
import {scoreWords, shortScoreWord} from "../../constants/scoreWords";
import PasswordStrengthBar from "react-password-strength-bar";

const ForgetPassword = () => {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const [dataSendResetPassword, setDataSendResetPassword] = useState({
        email: ''
    });
    const [dataResetPassword, setDataResetPassword] = useState({
        activate_token: '',
        password: '',
        repeat_password: ''
    });


    const handleOnChangeSendResetPassword = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setDataSendResetPassword((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleOnChangeResetPassword = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setDataResetPassword((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleSendResetPassword = () => {
        setShowLoader(true);
        sendResetPassword(dataSendResetPassword).then(res => {
            setSuccessMessage(res.success);
            setShowSuccess(true);
        }).catch((error) => {
            setErrorMessage(error);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleResetPassword = () => {
        setShowLoader(true);
        resetPassword(dataResetPassword).then(res => {
            setSuccessMessage(res.success);
            setShowSuccess(true);
        }).catch((error) => {
            setErrorMessage(error);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleKeyPressSendEmail = event => {
        if (event.key == 'Enter') {
            handleSendResetPassword();
        }
    };

    const handleKeyPressResetPassword = event => {
        if (event.key == 'Enter') {
            handleResetPassword();
        }
    };

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Zapomnia??e?? has??a?</h1>
                <hr className="my-4"/>
                <p>Wpisz sw??j adres email a wy??lemy Ci maila z danymi koniecznymi do resetu has??a</p>
                <div className="row">
                    <div className="col-lg-6">
                        <input type="email" id="email" className="form-control" name="email"
                               placeholder="E-mail" aria-describedby="emailHelp" value={dataSendResetPassword.email}
                               onChange={handleOnChangeSendResetPassword} onKeyPress={handleKeyPressSendEmail} />
                    </div>
                    <div className="col-lg-6">
                        <button style={{margin: '15px auto 25px auto'}}
                                onClick={() => handleSendResetPassword()}>Wy??lij kod do resetu has??a
                        </button>
                    </div>
                </div>
                <p>Wprowad?? kod do resetu has??a, kt??ry otrzyma??e?? na maila oraz wpisz nowe has??o</p>
                <div className="row">
                    <div className="col-lg-12">
                        <input type="text" className="form-control" name="activate_token"
                               placeholder="Kod do resetu has??a" value={dataResetPassword.activate_token}
                               onChange={handleOnChangeResetPassword} />
                    </div>
                    <div className="col-lg-4">
                        <label htmlFor="password">Nowe has??o</label>
                        <input type="password" className="form-control" name="password"
                               placeholder="Nowe has??o" value={dataResetPassword?.password}
                               onChange={handleOnChangeResetPassword}/>
                        <PasswordStrengthBar password={dataResetPassword.password} scoreWords={scoreWords} shortScoreWord={shortScoreWord} minLength={8} />
                    </div>
                    <div className="col-lg-4">
                        <label htmlFor="repeat_password">Powt??rz Nowe has??o</label>
                        <input type="password" className="form-control" name="repeat_password"
                               placeholder="Powt??rz nowe has??o" value={dataResetPassword?.repeat_password}
                               onChange={handleOnChangeResetPassword} onKeyPress={handleKeyPressResetPassword}/>
                    </div>
                    <div className="col-lg-4">
                        <button style={{margin: '15px auto 25px auto'}}
                                onClick={() => handleResetPassword()}>Zmie?? has??o
                        </button>
                    </div>
                </div>
            </div>
            <SweetAlert
                error
                show={showError}
                title="Co?? posz??o nie tak :("
                confirmBtnText="Ju?? poprawiam, Sir!"
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

export default ForgetPassword;