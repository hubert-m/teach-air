import React from "react";

const ActivationMain = () => {
    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Aktywacja konta</h1>
                <hr className="my-4"/>
                <p>Nie dostałeś maila z linkiem aktywacyjnym? Nie ma go nawet w spamie? Wyślij ponownie link aktywacyjny</p>
            </div>
            <p>Przycisk z ponownym wyslaniem linku aktywacyjnego na maila</p>
            <p>Formularz email i kod aktywacyjny</p>
        </>
    )
}

export default ActivationMain;