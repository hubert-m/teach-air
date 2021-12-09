import React, {useEffect, useState} from "react";
import ContainerGlobalSettings from "./ContainerGlobalSettings";
import {getFiles} from "../../helpers/Files";
import {sortDesc} from "../../helpers/sort";
import {getOptionsList} from "../../helpers/Options";
import LoaderScreen from "../../components/LoaderScreen";
import replaceNull from "../../helpers/replaceNull";

const Options = () => {
    const [showLoader, setShowLoader] = useState(false);
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
        console.log(data);
    }

    const handleOnReset = () => {
        /*
        setShowLoader(true);
        getOptionsList().then(list => {

            sortDesc(list, "id");
            setOptions(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
         */
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
                                {option_name === "file_extensions" ? "Dopuszczalne rozszerzenia plikow"
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
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default Options;