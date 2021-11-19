import React from "react";

function GlobalSettings({userToken, userData}) {
    console.log(userData);
    return (
        <>
            <div className="jumbotron">
                <h1 className="display-4">Globalne ustawienia strony</h1>
                <p className="lead">Tabela płci i formularz z możliwością dodawania kolejnych</p>
                <hr className="my-4"/>
            </div>
        </>
    )
}

export default GlobalSettings