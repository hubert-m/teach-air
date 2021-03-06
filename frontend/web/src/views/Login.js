import React, {useState} from 'react';
import {authenticate, getToken} from "../helpers/User";
import SweetAlert from 'react-bootstrap-sweetalert';
import Routes from "../constants/Routes";
import {useHistory} from "react-router";
import {Link} from "react-router-dom";


function Login({setUserToken}) {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [containerOfSetTimeout, setContainerOfSetTimeout] = useState();

    const login = (event) => {
        // event.preventDefault();
        authenticate({email, password}).then(() => {
            setShowSuccess(true);
            setContainerOfSetTimeout(setTimeout(() => {
                setUserToken(getToken());
                history.push(Routes.HOME);
            }, 4000));
        }).catch(errorMessage => {
            setErrorMessage(errorMessage);
            setShowError(true);
        });
    }

    const handleKeyPress = event => {
        if (event.key == 'Enter') {
            login();
        }
    };

    return (
        <>
            <div className="wrapper fadeInDown">
                <div id="formContentLogin">
                    <h2>Panel logowania</h2>
                    <input type="email" id="email" className="form-control fadeIn second" name="email"
                           placeholder="E-mail" aria-describedby="emailHelp" value={email}
                           onChange={e => setEmail(e.target.value)} onKeyPress={handleKeyPress} autoFocus/>
                    <input type="password" id="password" className="form-control fadeIn third" name="password"
                           placeholder="Hasło" value={password}
                           onChange={e => setPassword(e.target.value)} onKeyPress={handleKeyPress}/>
                    <button className="fadeIn fourth" style={{margin: '15px auto 25px auto'}}
                            onClick={() => login()}>Zaloguj
                    </button>
                    <div id="formFooter">
                        <Link to={Routes.FORGET_PASSWORD}>Zapomniałeś hasła?</Link><br />
                        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                        <Link to={Routes.USER_ACTIVATION_MAIN}>Twoje konto nie jest aktywne?</Link> {/*TODO*/}
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
                    setShowSuccess(false);
                    clearTimeout(containerOfSetTimeout);
                    setUserToken(getToken());
                    history.push(Routes.HOME);
                }}
            >
                Za chwile zostaniesz przekierowany na stronę główną
            </SweetAlert>
        </>
    );
}


export default Login;
