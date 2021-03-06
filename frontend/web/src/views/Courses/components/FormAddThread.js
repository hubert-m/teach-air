import React, {useEffect, useState} from "react";
import {
    Modal, ModalFooter,
    ModalHeader, ModalBody
} from "reactstrap";
import {IconsOptions} from "../../../constants/Icons";
import Select from "react-select";
import {isEmpty, isNull, size} from "lodash";
import {getSearchFiles} from "../../../helpers/Files";
import {sortDesc} from "../../../helpers/sort";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../../components/LoaderScreen";
import UploadFile from "../../Hosting/components/UploadFile";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {addThread, getThreadsList} from "../../../helpers/Thread";
import ListOfThreads from "./ListOfThreads";

const FormAddThread = ({course_id}) => {
    const [showError, setShowError] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [threadsList, setThreadsList] = useState([]);

    const [modalIsOpenAddThread, setModalIsOpenAddThread] = useState(false);
    const [data, setData] = useState({
        title: '',
        icon: null,
        description: '',
        content: '',
        files: []
    })

    const [lengthKeywordWhenOneRecord, setLengthKeywordWhenOneRecord] = useState(null);
    const [data_files, setData_files] = useState({
        keyword: '',
    });
    const [listOfFiles, setListOfFiles] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleOnChangeSelect = (e) => {
        setData((prevState) => ({
            ...prevState,
            icon: e,
        }))
    }


    const handleOnChange_files = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData_files((prevState) => ({
            ...prevState,
            ...result,
        }))

        if (e.target.value.length >= 3) {

            if (size(listOfFiles) == 1 && isNull(lengthKeywordWhenOneRecord)) {
                setLengthKeywordWhenOneRecord(e.target.value.length);
            }

            if (size(listOfFiles) > 1) {
                setLengthKeywordWhenOneRecord(null);
            }

            if (e.target.value.length < lengthKeywordWhenOneRecord || isNull(lengthKeywordWhenOneRecord)) {
                setShowLoader(true);
                getSearchFiles(e.target.value).then(list => {
                    sortDesc(list, "id");
                    setListOfFiles(list);
                }).catch(() => {
                }).finally(async () => {
                    await setShowLoader(false);
                })
            }
        } else if (e.target.value.length == 0) {
            setShowLoader(true);
            getSearchFiles().then(list => {
                sortDesc(list, "id");
                setListOfFiles(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }
    }

    const handleAddFiles = () => {
        setShowLoader(true);
        getSearchFiles(data_files?.keyword).then(list => {
            sortDesc(list, "id");
            setListOfFiles(list);
            setModalIsOpen(true);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    const handlePushFileToArr = (file) => {
        data?.files.push(file)
        setData((prevState) => ({
            ...prevState,
            files: data?.files,
        }))
    }

    const handleDeleteFileFromArray = (fileId) => {
        const newList = data?.files?.filter((item) => item.id !== fileId);
        setData((prevState) => ({
            ...prevState,
            files: newList,
        }))
    }

    const isFileAddedToArray = (file) => {
        return data?.files?.find((item) => {
                return item.id == file?.id
            }
        );
    }

    const handleAddThread = () => {
        const payload = {
            ...data,
            course_id: course_id,
            icon: data?.icon?.value
        }
        setShowLoader(true);
        addThread(payload).then(() => {
            setModalIsOpenAddThread(false);
            setData((prevState) => ({
                ...prevState,
                title: '',
                icon: null,
                description: '',
                content: '',
                files: []
            }))
            getThreadsList(course_id).then(list => {
                sortDesc(list, "id");
                setThreadsList(list);
            }).catch(() => {
            })
            setShowSuccess(true)
        }).catch((err) => {
            setErrorMessage(err);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    useEffect(() => {
        setShowLoader(true);
        getThreadsList(course_id).then(list => {
            sortDesc(list, "id");
            setThreadsList(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }, [course_id])


    return (
        <>
            <div className="row">
                <div className="col-lg-3">
                    <button style={{marginTop: '20px', marginBottom: '20px'}}
                            onClick={() => setModalIsOpenAddThread(true)}>Utw??rz nowy w??tek
                    </button>
                </div>
            </div>
            <ListOfThreads threadsList={threadsList}/>
            <Modal
                isOpen={modalIsOpenAddThread}
                toggle={() => setModalIsOpenAddThread(!modalIsOpenAddThread)}
                className="modal-lg"
            >
                <ModalHeader>Utw??rz nowy w??tek</ModalHeader>
                <ModalBody>
                    <label htmlFor="title">Tytu?? w??tku</label>
                    <input type="text" className="form-control" name="title"
                           placeholder="Tytu?? w??tku" value={data.title}
                           onChange={handleOnChange}/>
                    <label htmlFor="icon">Ikona dla w??tku</label>
                    <Select name="icon"
                            options={IconsOptions}
                            value={data.icon}
                            onChange={handleOnChangeSelect}
                            placeholder="Wybierz ikon?? dla w??tku *pole opcjonalne"
                            theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    neutral0: '#eee'
                                },
                            })}/>
                    <label htmlFor="description">Opis w??tku</label>
                    <textarea
                        className="form-control"
                        placeholder="Opis w??tku *pole opcjonalne"
                        rows="3"
                        name="description"
                        value={data.description}
                        onChange={handleOnChange}/>
                    <label htmlFor="content">Tre???? pierwszego postu</label>
                    <textarea
                        className="form-control"
                        placeholder="Tre???? postu"
                        rows="5"
                        name="content"
                        value={data.content}
                        onChange={handleOnChange}/>
                    {!isEmpty(data?.files) && (
                        <div className="col-lg-6">
                            <p>Dodane pliki (kliknij aby usun????):</p>
                            {data?.files?.map(({id, name, extension}) => (
                                    <span key={id} className="added-file"
                                          onClick={() => handleDeleteFileFromArray(id)}>{name}.{extension}</span>
                                )
                            )}
                        </div>
                    )}
                    <button type="button" className="btn btn-primary"
                            onClick={() => handleAddFiles()}>Do????cz pliki do postu
                    </button>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-primary"
                            onClick={() => handleAddThread()}>Dodaj w??tek
                    </button>
                    <button type="button" className="btn btn-secondary"
                            onClick={() => setModalIsOpenAddThread(false)}>Zamknij okno
                    </button>
                </ModalFooter>
            </Modal>

            <Modal
                isOpen={modalIsOpen}
                toggle={() => setModalIsOpen(!modalIsOpen)}
                className="modal-lg"
            >
                <ModalHeader>Pliki</ModalHeader>
                <ModalBody>
                    <UploadFile setMyFiles={setListOfFiles} attachFile={true} handlePushFileToArr={handlePushFileToArr}
                                keyword={data_files?.keyword}/>
                    <p style={{marginTop: '25px'}}>Wyszukaj plik (wprowad?? przynajmniej 3 znaki) (skasuj wszystkie znaki
                        aby pobra?? pe??n?? list??)</p>
                    <input type="text" id="keyword" className="form-control third" name="keyword"
                           placeholder="Wpisz przynajmniej 3 znaki" value={data_files.keyword}
                           onChange={handleOnChange_files}/>
                    <div className="table-responsive">
                        <table className="table" style={{marginTop: '25px'}}>
                            <thead>
                            <tr>
                                <th scope="col">Nazwa pliku</th>
                                <th scope="col">Rozszerzenie</th>
                                <th scope="col">Rozmiar</th>
                                <th scope="col">Do????cz</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isEmpty(listOfFiles) ? (<tr>
                                <td colSpan={4}>Brak plikow</td>
                            </tr>) : listOfFiles?.map((props) => {
                                const {id, name, url, extension, size} = props;
                                return (
                                    <tr key={id}>
                                        <td>
                                            <a href={url}>{name}.{extension}</a>
                                        </td>
                                        <td>{extension}</td>
                                        <td>{Math.ceil(size / 1024)}KB</td>
                                        <td>
                                            {isFileAddedToArray(props) ? (
                                                <button type="button" className="btn btn-danger"
                                                        onClick={() => handleDeleteFileFromArray(id)}>
                                                    <FontAwesomeIcon
                                                        icon={faMinus}/>
                                                </button>
                                            ) : (
                                                <button type="button" className="btn btn-success"
                                                        onClick={() => handlePushFileToArr(props)}><FontAwesomeIcon
                                                    icon={faPlus}/>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-success"
                            onClick={() => setModalIsOpen(false)}>Gotowe
                    </button>
                </ModalFooter>
            </Modal>

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
                Pomy??lnie dodano nowy w??tek
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default FormAddThread;