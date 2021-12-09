import React, {useEffect, useState} from "react";
import ContainerGlobalSettings from "./ContainerGlobalSettings";
import {sortDesc} from "../../helpers/sort";
import {getOptionsList, updateOptions} from "../../helpers/Options";
import LoaderScreen from "../../components/LoaderScreen";
import SweetAlert from "react-bootstrap-sweetalert";

const Options = () => {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [options, setOptions] = useState([]);

    const [data, setData] = useState({});

    useEffect(() => {
        setShowLoader(true);
        getOptionsList().then(list => {
            sortDesc(list, "id");
            setOptions(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
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

    const handleOnUpdate = () => {
        setShowLoader(true);
        updateOptions(data).then(() => {
            setShowSuccess(true);
            getOptionsList().then(list => {
                sortDesc(list, "id");
                setOptions(list);
            }).catch(() => {
            })
            setData({});
        }).catch((err) => {
            setErrorMessage(err);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleOnReset = () => {
        setData({});
    }

    return (
        <>
            <ContainerGlobalSettings>
                <div className="jumbotron">
                    <h1 className="display-7">Opcje</h1>
                    <hr className="my-4"/>
                </div>
                <div className="row">
                    {options.map(({id, option_name, option_value}) => (
                        <div className="col-lg-6 offset-lg-3" key={id}>
                            <label htmlFor={option_name}>
                                {option_name === "file_extensions" ? "Dopuszczalne rozszerzenia plikow (po przecinku)"
                                    : option_name === "max_file_size" ? "Maksymalna waga pliku uploadowanego (KB)"
                                        : option_name}</label>
                            <input type="text" className="form-control" name={option_name}
                                   placeholder="Wpisz przynajmniej 3 znaki" value={data[option_name] || option_value}
                                   onChange={handleOnChange}/>
                        </div>
                    ))}
                    <div className="col-lg-3 offset-lg-3">
                        <button style={{marginTop: '20px'}}
                                onClick={() => handleOnUpdate()}>Zaktualizuj
                        </button>
                    </div>
                    <div className="col-lg-3">
                        <button style={{marginTop: '20px'}}
                                onClick={() => handleOnReset()}>Cofnij zmiany
                        </button>
                    </div>
                </div>
            </ContainerGlobalSettings>
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
                Pomyślnie zaktualizowano ustawienia
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default Options;