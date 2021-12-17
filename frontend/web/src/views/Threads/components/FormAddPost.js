import {isEmpty, isNull, size} from "lodash";
import React, {useState} from "react";
import {getSearchFiles} from "../../../helpers/Files";
import {sortDesc} from "../../../helpers/sort";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../../components/LoaderScreen";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import UploadFile from "../../Hosting/components/UploadFile";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {getMessages, sendMessage} from "../../../helpers/Message";
import {addPost, getPosts} from "../../../helpers/Thread";

const FormAddPost = ({thread_id, setPosts}) => {
    const [showError, setShowError] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [data, setData] = useState({
        message: '',
        thread_id: thread_id,
        files: []
    });
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

    const handleOnChange_files = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData_files((prevState) => ({
            ...prevState,
            ...result,
        }))

        if (e.target.value.length >= 3) {

            if (size(listOfFiles) === 1 && isNull(lengthKeywordWhenOneRecord)) {
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
        } else if (e.target.value.length === 0) {
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
                return item.id === file?.id
            }
        );
    }

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleAddPost();
        }
    };

    const handleAddPost = () => {
        setShowLoader(true);
        addPost(data).then(() => {

            setData((prevState) => ({
                ...prevState,
                content: '',
                files: []
            }))

            getPosts(thread_id).then(list => {
                setPosts(list);
            }).catch(() => {
            })
        }).catch((e) => {
            setErrorMessage(e);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        })
    }

    return (
        <>
            <div className="row">
                <div className="col-lg-6 offset-lg-3">
                    <textarea
                        className="form-control"
                        placeholder="Treść wiadomości"
                        rows="5"
                        name="content"
                        style={{marginTop: '20px'}}
                        value={data.content}
                        onKeyPress={handleKeyPress}
                        onChange={handleOnChange}/>
                </div>
                {!isEmpty(data?.files) && (
                    <div className="col-lg-6 offset-lg-3">
                        <p>Dodane pliki (kliknij aby usunąć):</p>
                        {data?.files?.map(({id, name, extension}) => (
                                <span key={id} className="added-file"
                                      onClick={() => handleDeleteFileFromArray(id)}>{name}.{extension}</span>
                            )
                        )}
                    </div>
                )}
                <div className="col-lg-3 offset-lg-3">
                    <button style={{marginTop: '20px'}}
                            onClick={() => handleAddFiles()}>Dołącz pliki do postu
                    </button>
                </div>
                <div className="col-lg-3">
                    <button style={{marginTop: '20px'}}
                            onClick={() => handleAddPost()}>Dodaj post
                    </button>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                toggle={() => setModalIsOpen(!modalIsOpen)}
                className="modal-lg"
            >
                <ModalHeader>Pliki</ModalHeader>
                <ModalBody>
                    <UploadFile setMyFiles={setListOfFiles} attachFile={true} handlePushFileToArr={handlePushFileToArr} keyword={data_files?.keyword} />
                    <p style={{ marginTop: '25px' }}>Wyszukaj plik (wprowadź przynajmniej 3 znaki) (skasuj wszystkie znaki aby pobrać pełną listę)</p>
                    <input type="text" id="keyword" className="form-control third" name="keyword"
                           placeholder="Wpisz przynajmniej 3 znaki" value={data_files.keyword}
                           onChange={handleOnChange_files}/>
                    <table className="table" style={{ marginTop: '25px' }}>
                        <thead>
                        <tr>
                            <th scope="col">Nazwa pliku</th>
                            <th scope="col">Rozszerzenie</th>
                            <th scope="col">Rozmiar</th>
                            <th scope="col">Dołącz</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isEmpty(listOfFiles) ? (<tr><td colSpan={4}>Brak plikow</td></tr>) : listOfFiles?.map((props) => {
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
                title="Coś poszło nie tak :("
                confirmBtnText="Już poprawiam, Sir!"
                confirmBtnBsStyle="danger"
                onConfirm={() => setShowError(false)}
            >
                {errorMessage}
            </SweetAlert>
            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default FormAddPost;