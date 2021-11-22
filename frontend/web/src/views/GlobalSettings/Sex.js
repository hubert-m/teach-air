import React, {useEffect, useState} from "react";
import {addSex, getSexList} from "../../helpers/User";
import SweetAlert from "react-bootstrap-sweetalert";
import ContainerGlobalSettings from "./ContainerGlobalSettings";
import LoaderScreen from "../../components/LoaderScreen";

const Sex = () => {
    const [sexList, setSexList] = useState([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [data, setData] = useState({
        sex: '',
    });

    useEffect(() => {
        setShowLoader(true);
        getSexList().then(list => {
            setSexList(list);
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

    const handleAddSex = () => {
        addSex(data).then(() => {
            setData((prevState) => ({
                ...prevState,
                sex: '',
            }))
            setShowSuccess(true);
            getSexList().then(list => {
                setSexList(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }).catch(errorMessage => {
            setErrorMessage(errorMessage);
            setShowError(true);
        });
    }

    return (
        <ContainerGlobalSettings>
            <div className="jumbotron">
                <h1 className="display-7">Płeć</h1>
                <hr className="my-4"/>
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <input type="text" id="sex" className="form-control third" name="sex"
                           placeholder="Płeć" value={data.sex}
                           onChange={handleOnChange}/>
                </div>
                <div className="col-lg-6">
                    <button className="fourth" style={{marginTop: '5px'}} onClick={() => handleAddSex()}>Dodaj płeć
                    </button>
                </div>

            </div>

            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Płeć</th>
                </tr>
                </thead>
                <tbody>
                {sexList.map(({id, value}) => (
                    <tr key={id}>
                        <th scope="row">{id}</th>
                        <td>{value}</td>
                    </tr>
                ))}
                </tbody>
            </table>


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
                Pomyślnie dodano nową płeć
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </ContainerGlobalSettings>
    )


}

export default Sex;