import React, {useEffect, useState} from "react";
import {addSex, getAllUsers, getSexList} from "../helpers/User";
import Routes from "../constants/Routes";
import SweetAlert from "react-bootstrap-sweetalert";
import {useHistory} from "react-router";

function GlobalSettings({userToken, userData}) {
    const history = useHistory();
    const [sexList, setSexList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [data, setData] = useState({
        sex: '',
    });

    useEffect(() => {
        getSexList().then(list => {
            setSexList(list);
        }).catch(() => {
        })

        getAllUsers().then(list => {
            setUsersList(list);
        }).catch(() => {
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
            setShowSuccess(true);
            getSexList().then(list => {
                setSexList(list);
            }).catch(() => {
            })
        }).catch(errorMessage => {
            setErrorMessage(errorMessage);
            setShowError(true);
        });
    }

    return (
        <>
            <div className="jumbotron">
                <h1 className="display-4">Globalne ustawienia aplikacji</h1>
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
                    <tr>
                        <th scope="row">{id}</th>
                        <td>{value}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="jumbotron">
                <h1 className="display-7">Użytkownicy</h1>
                <hr className="my-4"/>
            </div>

            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Imię</th>
                    <th scope="col">Nazwisko</th>
                    <th scope="col">Płeć</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Telefon</th>
                </tr>
                </thead>
                <tbody>
                {usersList.map(({id, email, name, second_name, lastname, sex_id, phone}) => (
                    <tr>
                        <th scope="row">{id}</th>
                        <td>{name} {second_name}</td>
                        <td>{lastname}</td>
                        <td>{sex_id?.value}</td>
                        <td>{email}</td>
                        <td>{phone}</td>
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
        </>
    )
}

export default GlobalSettings