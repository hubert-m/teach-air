import React, {useEffect, useState} from 'react';
import * as _ from "lodash";
import {authenticate, getToken} from "../helpers/User";
import Routes from "../constants/Routes";
import SweetAlert from 'react-bootstrap-sweetalert';
import {useHistory} from "react-router";

function Login({setUserToken}) {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (!!getToken()) {
            history.push(Routes.HOME);
        }
    }, [])

    const login = (event) => {
        // event.preventDefault();
        authenticate({email, password}).then(() => {
            setUserToken(getToken());
            setShowSuccess(true);
            setTimeout(() => {
                history.push(Routes.HOME);
            }, 4000)
        }).catch(errorMessage => {
            setErrorMessage(errorMessage);
            setShowError(true);
        });
    }

    return (
        <React.Fragment>
            <div className="row justify-content-md-center">
                <div className="col-md-5">
                    <div className="shadow-sm p-5 mb-5 bg-white rounded mt-5">
                        <div className="form-group">
                            <label htmlFor="email">Adres e-mail</label>
                            <input type="email" className="form-control" id="email"
                                   aria-describedby="emailHelp" placeholder="E-mail"
                                   value={email}
                                   onChange={e => setEmail(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Hasło</label>
                            <input type="password" className="form-control" id="password"
                                   placeholder="Hasło"
                                   value={password}
                                   onChange={e => setPassword(e.target.value)}/>
                        </div>
                        <button className="btn btn-primary"
                                onClick={() => login()}>Zaloguj
                        </button>
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
                            Za chwile zostaniesz przekierowany na stronę główną
                        </SweetAlert>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );

}


export default Login;
