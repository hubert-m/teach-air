import React, {useState} from "react";
import {useHistory, useParams} from "react-router";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../components/LoaderScreen";
import {resetPassword} from "../../helpers/User";
import Routes from "../../constants/Routes";

const ForgetPasswordWithCode = () => {
    let {code} = useParams();
    const history = useHistory();

    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const [dataResetPassword, setDataResetPassword] = useState({
        activate_token: code,
        password: '',
        repeat_password: ''
    });



    const handleOnChangeResetPassword = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setDataResetPassword((prevState) => ({
            ...prevState,
            ...result,
        }))
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

    const handleKeyPress = event => {
        if (event.key == 'Enter') {
            handleResetPassword();
        }
    };

    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Reset hasła</h1>
                <hr className="my-4"/>
                <p>Wprowadź nowe hasło</p>
                <div className="row">
                    <div className="col-lg-12">
                        <label htmlFor="activate_token">Kod do resetu hasła</label>
                        <input type="text" className="form-control" name="activate_token"
                               placeholder="Kod do resetu hasła" value={dataResetPassword.activate_token}
                               onChange={handleOnChangeResetPassword} disabled />
                    </div>
                    <div className="col-lg-4">
                        <label htmlFor="password">Nowe hasło</label>
                        <input type="password" className="form-control" name="password"
                               placeholder="Nowe hasło" value={dataResetPassword?.password}
                               onChange={handleOnChangeResetPassword} autoFocus/>
                    </div>
                    <div className="col-lg-4">
                        <label htmlFor="repeat_password">Powtórz Nowe hasło</label>
                        <input type="password" className="form-control" name="repeat_password"
                               placeholder="Powtórz nowe hasło" value={dataResetPassword?.repeat_password}
                               onChange={handleOnChangeResetPassword} onKeyPress={handleKeyPress}/>
                    </div>
                    <div className="col-lg-4">
                        <button style={{margin: '15px auto 25px auto'}}
                                onClick={() => handleResetPassword()}>Zmień hasło
                        </button>
                    </div>
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
                onConfirm={() => {
                    setShowSuccess(false)
                    history.push(Routes.LOGIN);
                }}
            >
                {successMessage}
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default ForgetPasswordWithCode;