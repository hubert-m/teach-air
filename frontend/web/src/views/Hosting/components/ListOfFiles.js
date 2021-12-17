import {isEmpty, isNull, size} from "lodash";
import SimpleReactLightbox, {SRLWrapper} from "simple-react-lightbox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import {deleteFile, getSearchFiles} from "../../../helpers/Files";
import {sortDesc} from "../../../helpers/sort";
import LoaderScreen from "../../../components/LoaderScreen";

const ListOfFiles = ({
                         myFiles = [], setMyFiles = () => {
    }
                     }) => {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [lengthKeywordWhenOneRecord, setLengthKeywordWhenOneRecord] = useState(null);
    const [data, setData] = useState({
        keyword: '',
    });

    const handleDeleteFile = (id) => {
        setShowLoader(true);
        deleteFile(id).then(() => {
            getSearchFiles(data?.keyword).then(list => {
                sortDesc(list, "id");
                setMyFiles(list);
            }).catch(() => {
            })
        }).catch((err) => {
            setErrorMessage(err);
            setShowError(true);
        }).finally(async () => {
            await setShowLoader(false);
        });
    }

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))

        if (e.target.value.length >= 3) {

            if (size(myFiles) == 1 && isNull(lengthKeywordWhenOneRecord)) {
                setLengthKeywordWhenOneRecord(e.target.value.length);
            }

            if (size(myFiles) > 1) {
                setLengthKeywordWhenOneRecord(null);
            }

            if (e.target.value.length < lengthKeywordWhenOneRecord || isNull(lengthKeywordWhenOneRecord)) {
                setShowLoader(true);
                getSearchFiles(e.target.value).then(list => {
                    sortDesc(list, "id");
                    setMyFiles(list);
                }).catch(() => {
                }).finally(async () => {
                    await setShowLoader(false);
                })
            }
        } else if (e.target.value.length == 0) {
            setShowLoader(true);
            getSearchFiles().then(list => {
                sortDesc(list, "id");
                setMyFiles(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
            })
        }
    }

    return (
        <>
            <p>Wyszukaj plik (wprowadź przynajmniej 3 znaki) (skasuj wszystkie znaki aby pobrać pełną listę)</p>
            <input type="text" id="keyword" className="form-control third" name="keyword"
                   placeholder="Wpisz przynajmniej 3 znaki" value={data.keyword}
                   onChange={handleOnChange}/>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Nazwa pliku</th>
                        <th scope="col">Użyć w postach</th>
                        <th scope="col">Użyć w wiadomościach</th>
                        <th scope="col">Rozszerzenie</th>
                        <th scope="col">Rozmiar</th>
                        <th scope="col">&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isEmpty(myFiles) ? (<tr>
                        <td colSpan={6}>Brak plikow</td>
                    </tr>) : myFiles?.map(({id, name, url, extension, size, usedInMessages, usedInPosts}) => (
                        <tr key={id}>
                            <td>
                                {extension == "jpg" || extension == "jpeg" || extension == "png" ? (
                                    <>
                                        <SimpleReactLightbox>
                                            <SRLWrapper>
                                                <a href={url}><img src={url}
                                                                   style={{maxWidth: '50px', height: 'auto'}}
                                                                   alt=""/></a>
                                            </SRLWrapper>
                                        </SimpleReactLightbox>
                                        {name}.{extension}
                                    </>
                                ) : (
                                    <a href={url}>{name}.{extension}</a>
                                )}
                            </td>
                            <td>{usedInPosts}</td>
                            <td>{usedInMessages}</td>
                            <td>{extension}</td>
                            <td>{Math.ceil(size / 1024)}KB</td>
                            <td>
                                {usedInMessages == 0 && usedInPosts == 0 && (
                                    <button type="button" className="btn btn-danger"
                                            onClick={() => handleDeleteFile(id)}><FontAwesomeIcon
                                        icon={faTrash}/>
                                    </button>
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

export default ListOfFiles;