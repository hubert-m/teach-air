import {useParams} from "react-router";
import React from "react";

const Activation = () => {
    let {code} = useParams();
    return (
        <>
            <div className="jumbotron" style={{marginTop: '50px'}}>
                <h1 className="display-7">Kod aktywacyjny użytkownika - {code}</h1>
                <hr className="my-4"/>
                <p>Przekazać go do API, które zmieni status z 0 na 1 jeśli kod jest poprawny</p>
            </div>
        </>
    )
}

export default Activation;