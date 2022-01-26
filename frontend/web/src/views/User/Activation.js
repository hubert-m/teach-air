import {useHistory, useParams} from "react-router";
import React, {useState, useEffect} from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../components/LoaderScreen";
import {activateAccount} from "../../helpers/User";
import Routes from "../../constants/Routes";

const Activation = () => {
    let {code} = useParams();
    const history = useHistory();

    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const data = {
            activate_token: code
        }

        setShowLoader(true);
        activateAccount(data).then(res => {
            setSuccessMessage(res.success);
            setShowSuccess(true);
        }).catch((error) => {
            setErrorMessage(error);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }, [])

    return (
        <>
            <SweetAlert
                error
                show={showError}
                title="Coś poszło nie tak :("
                confirmBtnText="Już poprawiam, Sir!"
                confirmBtnBsStyle="danger"
                onConfirm={() => {
                    setShowError(false)
                    history.push(Routes.USER_ACTIVATION_MAIN);
                }}
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

export default Activation;