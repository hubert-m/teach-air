import React, {useEffect, useState} from "react";
import ContainerGlobalSettings from "./ContainerGlobalSettings";
import {sortDesc} from "../../helpers/sort";
import {addOption, getOptionsList, updateOptions} from "../../helpers/Options";
import LoaderScreen from "../../components/LoaderScreen";
import SweetAlert from "react-bootstrap-sweetalert";

const Options = () => {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [options, setOptions] = useState([]);

    const [data, setData] = useState({});
    const [data_add, setData_add] = useState({
        option_name: "",
        option_value: ""
    })

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

    const handleOnChangeAddOption = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData_add((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleOnUpdate = () => {
        setShowLoader(true);
        updateOptions(data).then(() => {
            setSuccessMessage("Pomyślnie zaktualizowano ustawienia");
            setShowSuccess(true);
            getOptionsList().then(list => {
                sortDesc(list, "id");
                setOptions(list);
            }).catch(() => {
            })
            setData({});
        }).catch((err) => {
            setErrorMessage(err);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handleOnReset = () => {
        setData({});
    }

    const handleAddOption = () => {
        setShowLoader(true);
        addOption(data_add).then(() => {
            setSuccessMessage("Pomyślnie dodano opcje");
            setShowSuccess(true);
            getOptionsList().then(list => {
                sortDesc(list, "id");
                setOptions(list);
            }).catch(() => {
            })
            setData_add({
                option_name: "",
                option_value: ""
            });
        }).catch((err) => {
            setErrorMessage(err);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
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
                                {option_name == "file_extensions" ? "Dopuszczalne rozszerzenia plikow (po przecinku)"
                                    : option_name == "max_file_size" ? "Maksymalna waga pliku uploadowanego (KB)"
                                        : option_name}</label>
                            <input type="text" className="form-control" name={option_name}
                                   placeholder={option_name} value={data[option_name] || option_value}
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
                <div className="jumbotron" style={{marginTop: '50px'}}>
                    <h1 className="display-7">Dla deweloperów</h1>
                    <hr className="my-4"/>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label htmlFor="option_name">Klucz (bez spacji i z _)</label>
                        <input type="text" className="form-control" name="option_name"
                               placeholder="Klucz" value={data_add?.option_name}
                               onChange={handleOnChangeAddOption}/>
                    </div>
                    <div className="col-lg-4">
                        <label htmlFor="option_value">Wartość</label>
                        <input type="text" className="form-control" name="option_value"
                               placeholder="Wartość" value={data_add?.option_value}
                               onChange={handleOnChangeAddOption}/>
                    </div>
                    <div className="col-lg-4">
                        <button style={{marginTop: '20px'}}
                                onClick={() => handleAddOption()}>Dodaj
                        </button>
                    </div>
                    <div className="col-lg-12">
                        <p>Możesz zdefiniować kolejne klucze wraz z wartością przechowywane w bazie danych, a wartości
                            możesz wygodnie zmieniać tutaj będąc zalogowanym jako administrator</p>
                        <p>Otwiera to szerokie możliwości na rozwój aplikacji oraz przyspiesza proces wprowadzania
                            zmian</p>
                        <p>Na tą chwilę wszystkie endpointy API komunikujące się z tabelą "<b>options</b>" wymagają
                            tokenu
                            zawierającego w sobie ID użytkownika, który jest administratorem czyli ma status równy 3,
                            więc perspektywa użycia
                            funkcji dodawania kolejnych stałych jest tylko po stronie backendu, ale nic nie stoi na
                            przeszkodzie, aby dopisać kolejny endpoint, który będzie zwracał tylko oczekiwane przez nas
                            dane (dostępne dla wszystkich lub konkretnych użytkowników) i wtedy możemy wyświetlić je na
                            stronie</p>
                        <p>Poniżej przykład użycia na stworzonej już stałej <b>max_file_size</b></p>
                        <p><code>use App\Models\Option;</code> // Na początku kontrolera musimy podpiąć
                            model <b>Option</b> będący reprezentantem obiektu z tablicy <b>options</b></p>
                        <code>$settings_max_file_size = Option::where('option_name', '=',
                            'max_file_size')->first()->option_value;</code>
                        <p>Tym sposobem w zmiennej <code>$settings_max_file_size</code> przechowujemy zdefiniowaną
                            wartość dla klucza <b>max_file_size</b> i możemy to w dowolny sposób wykorzystać</p>
                        <p>Przykład zastosowania przy api <b>/files/upload</b> do wgrywania plików na serwer</p>
                        <p><code>$size = $request->file('file')->getSize();</code> // waga wgrywanego pliku wyrażona w
                            Bajtach</p>
                        <p><code>$settings_max_file_size = Option::where('option_name', '=',
                            'max_file_size')->first()->option_value;</code> // zdefiniowana maksymalna waga pliku w
                            Kilobajtach</p>
                        <p><code>$settings_max_file_size = intval($settings_max_file_size) * 1024</code> // konwersja na
                            int oraz mnożenie przez 1024 aby otrzymać wartość zdefiniowanej maksymalnej wagi pliku w
                            Bajtach</p>
                        <p><code>if($size > $settings_max_file_size) return $this->responseRequestError('File is too
                            large', 400);</code> // zwracamy kod błędu 400 wraz z komunikatem, iż wgrywany plik jest
                            zbyt duży</p>
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
                {successMessage}
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default Options;