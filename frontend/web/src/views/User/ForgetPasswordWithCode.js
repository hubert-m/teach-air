import React, {useState} from "react";
import {useParams} from "react-router";

const ForgetPasswordWithCode = () => {
    let {code} = useParams();

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
        // zmien haslo
    }

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
                               onChange={handleOnChangeResetPassword}/>
                    </div>
                    <div className="col-lg-4">
                        <label htmlFor="repeat_password">Powtórz Nowe hasło</label>
                        <input type="password" className="form-control" name="repeat_password"
                               placeholder="Powtórz nowe hasło" value={dataResetPassword?.repeat_password}
                               onChange={handleOnChangeResetPassword}/>
                    </div>
                    <div className="col-lg-4">
                        <button style={{margin: '15px auto 25px auto'}}
                                onClick={() => handleResetPassword()}>Zmień hasło
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgetPasswordWithCode;