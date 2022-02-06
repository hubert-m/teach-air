import React, {useEffect, useState} from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import Routes from "../constants/Routes";
import {useHistory} from "react-router";
import {Link} from "react-router-dom";
import {getSexList, register} from "../helpers/User";
import PasswordStrengthBar from "react-password-strength-bar";
import {scoreWords, shortScoreWord} from "../constants/scoreWords";


const Register = () => {
    const history = useHistory();

    const [data, setData] = useState({
        email: '',
        password: '',
        passwordRepeat: '',
        name: '',
        lastname: '',
        sex_id: '',
    });

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [sexList, setSexList] = useState([]);

    useEffect(() => {
        getSexList().then(list => {
            setSexList(list);
        }).catch(() => {
        })
    }, [])

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleRegister = () => {
        register(data).then(() => {
            setShowSuccess(true);
            setTimeout(() => {
                history.push(Routes.LOGIN);
            }, 5000)
        }).catch(errorMessage => {
            setErrorMessage(errorMessage);
            setShowError(true);
        });
    }

    const handleKeyPress = event => {
        if (event.key == 'Enter') {
            handleRegister();
        }
    };

    return (
        <>
            <div className="wrapper fadeInDown">
                <div id="formContentRegister">
                    <h2>Rejestracja</h2>
                    <div className="row">
                        <div className="col-lg-6">
                            <input type="email" id="email" className="form-control fadeIn second" name="email"
                                   placeholder="E-mail" aria-describedby="emailHelp" value={data.email}
                                   onChange={handleOnChange} onKeyPress={handleKeyPress} autoFocus/>
                            <input type="password" id="password" className="form-control fadeIn third" name="password"
                                   placeholder="Hasło" value={data.password}
                                   onChange={handleOnChange} onKeyPress={handleKeyPress}/>
                            <input type="password" id="passwordRepeat" className="form-control fadeIn third"
                                   name="passwordRepeat"
                                   placeholder="Powtórz hasło" value={data.passwordRepeat}
                                   onChange={handleOnChange} onKeyPress={handleKeyPress}/>
                            <PasswordStrengthBar password={data.password} scoreWords={scoreWords} shortScoreWord={shortScoreWord} minLength={8} />
                        </div>
                        <div className="col-lg-6">
                            <input type="text" id="name" className="form-control fadeIn second" name="name"
                                   placeholder="Imię" value={data.name}
                                   onChange={handleOnChange} onKeyPress={handleKeyPress}/>
                            <input type="text" id="lastname" className="form-control fadeIn third" name="lastname"
                                   placeholder="Nazwisko" value={data.lastname}
                                   onChange={handleOnChange} onKeyPress={handleKeyPress}/>
                            <select className="fadeIn third" name="sex_id" onChange={handleOnChange} onKeyPress={handleKeyPress}>
                                <option selected disabled>Wybierz płeć</option>
                                {sexList.map(({id, value}) => (
                                    <option value={id}>{value}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button className="fadeIn fourth" style={{margin: '15px auto 25px auto'}}
                            onClick={() => handleRegister()}>Zarejestruj
                    </button>
                    <div id="formFooter">
                        Masz już konto?<br/>
                        <Link to={Routes.LOGIN}>Zaloguj się</Link>
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
                onConfirm={() => setShowSuccess(false)}
            >
                Za chwile zostaniesz przekierowany do panelu logowania<br/>
                Na maila przyjdzie Ci link aktywacyjny
            </SweetAlert>
        </>
    );
}


export default Register;
