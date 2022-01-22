import React from "react";

const ForgetPassword = () => {
    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Zapomniałeś hasła?</h1>
                <hr className="my-4"/>
                <p>Formularz z adresem email => wyslij maila ze zresetowanym tokenem, a ponizej formularz</p>
                <p>Adres email, token z maila, nowe haslo, powtorz nowe haslo</p>
            </div>
        </>
    )
}

export default ForgetPassword;