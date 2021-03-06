import React, {useEffect, useState} from "react";
import {addSex, deleteSex, getSexList} from "../../helpers/User";
import SweetAlert from "react-bootstrap-sweetalert";
import ContainerGlobalSettings from "./ContainerGlobalSettings";
import LoaderScreen from "../../components/LoaderScreen";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {sortDesc} from "../../helpers/sort";

const Sex = ({userData}) => {
    const [sexList, setSexList] = useState([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [data, setData] = useState({
        sex: '',
    });
    const [showWarningDeleteMessage, setShowWarningMessage] = useState();

    useEffect(() => {
        setShowLoader(true);
        getSexList().then(list => {
            sortDesc(list, "id");
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
                sortDesc(list, "id");
                setSexList(list);
            }).catch(() => {
            })
        }).catch(errorMessage => {
            setErrorMessage(errorMessage);
            setShowError(true);
        });
    }

    const handleDeleteSex = (id, count_users, forceDelete = false) => {
        if (count_users == 0 || forceDelete) {
            setShowWarningMessage({
                id: id,
                isWarning: false
            })

            setShowLoader(true);
            deleteSex(id).then(() => {
                getSexList().then(list => {
                    sortDesc(list, "id");
                    setSexList(list);
                }).catch(() => {
                }).finally(async () => {
                    await setShowLoader(false);
                })
            }).catch((err) => {
                setErrorMessage(err)
                setShowError(true)
            });

        } else {
            setShowWarningMessage({
                id: id,
                isWarning: true
            })
        }
    }

    const handleKeyPress = event => {
        if (event.key == 'Enter') {
            handleAddSex();
        }
    };

    return (
        <ContainerGlobalSettings>
            <div className="jumbotron">
                <h1 className="display-7">P??e??</h1>
                <hr className="my-4"/>
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <input type="text" id="sex" className="form-control third" name="sex"
                           placeholder="Wprowad?? nazw?? p??ci" value={data.sex}
                           onKeyPress={handleKeyPress}
                           onChange={handleOnChange}/>
                </div>
                <div className="col-lg-6">
                    <button style={{marginTop: '5px'}} onClick={() => handleAddSex()}>Dodaj p??e??
                    </button>
                </div>

            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">P??e??</th>
                        <th scope="col">Zarejestrowanych u??ytkownik??w</th>
                        <th scope="col">&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sexList.map(({id, value, count_users}) => (
                        <tr key={id}>
                            <th scope="row">{id}</th>
                            <td>{value}</td>
                            <td>{count_users}</td>
                            <td>
                                {userData?.sex_id?.id == id ? (
                                    <td><span className="badge bg-danger">To Twoja p??e??</span>
                                    </td>
                                ) : (
                                    <>
                                        <button type="button" className="btn btn-danger"
                                                onClick={() => handleDeleteSex(id, count_users)}><FontAwesomeIcon
                                            icon={faTrash}/>
                                        </button>
                                        <SweetAlert
                                            warning
                                            showCancel
                                            show={showWarningDeleteMessage?.id == id && showWarningDeleteMessage?.isWarning}
                                            title="Czy na pewno?"
                                            confirmBtnText="Tak, skasuj"
                                            cancelBtnText="Nie, zostaw"
                                            confirmBtnBsStyle="danger"
                                            cancelBtnBsStyle="secondary"
                                            onConfirm={() => handleDeleteSex(id, count_users, true)}
                                            onCancel={() => setShowWarningMessage({
                                                id: id,
                                                isWarning: false
                                            })}
                                        >
                                            {count_users} zarejestrowanych u??ytkownik??w posiada t?? p??e??. Skasowanie p??ci
                                            spowoduje
                                            skasowanie r??wnie?? tych u??ytkonik??w. Proces jest nieodwracalny. Chcesz
                                            usun????
                                            p??e?? {value} ?
                                        </SweetAlert>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>


            <SweetAlert
                error
                show={showError}
                title="Co?? posz??o nie tak :("
                confirmBtnText="Ju?? poprawiam, Sir!"
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
                Pomy??lnie dodano now?? p??e??
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </ContainerGlobalSettings>
    )


}

export default Sex;