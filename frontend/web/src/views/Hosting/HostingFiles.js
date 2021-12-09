import React, {useEffect, useState} from 'react';
import {deleteFile, getFiles, uploadFile} from "../../helpers/Files";
import Dropzone from "react-dropzone";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../components/LoaderScreen";
import {sortDesc} from "../../helpers/sort";
import {isEmpty} from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {cutExtensionFromFile, getOnlyExtensionFromFile} from "../../helpers/fileNames";
import SimpleReactLightbox from 'simple-react-lightbox'
import {SRLWrapper} from "simple-react-lightbox";
import {deleteSex, getSexList} from "../../helpers/User";

const HostingFiles = () => {
    const [showLoader, setShowLoader] = useState(false);

    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [myFiles, setMyFiles] = useState([]);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const [data, setData] = useState({
        fileName: '',
    });

    const onDrop = (files) => {
        if (files.length > 0) {
            setSelectedFiles(files);
            console.log(files.name);
            setData({
                fileName: cutExtensionFromFile(files[0].name)
            })
        }
    }

    const upload = () => {
        setProgress(0);
        setCurrentFile(selectedFiles[0]);

        uploadFile(selectedFiles[0], data?.fileName, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }).then(() => {

            getFiles().then(list => {
                sortDesc(list, "id");
                setMyFiles(list);
            }).catch(() => {
            })

            setSuccessMessage("Pomyślnie udało się wgrać plik :)");
            setShowSuccess(true);

        }).catch((err) => {
            setErrorMessage(err);
            setShowError(true);
        }).finally(() => {
            setProgress(0);
            setCurrentFile(undefined);
        })

        setSelectedFiles(undefined);
    }

    useEffect(() => {
        setShowLoader(true);
        getFiles().then(list => {
            sortDesc(list, "id");
            setMyFiles(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }, []);

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    const handleDeleteFile = (id) => {
        setShowLoader(true);
        deleteFile(id).then(() => {
            getFiles().then(list => {
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


    return (
        <>
            <div className="jumbotron">
                <h1 className="display-7">Wgraj plik</h1>
                <hr className="my-4"/>
            </div>
            <div>
                {currentFile && (
                    <div className="progress mb-3">
                        <div
                            className="progress-bar progress-bar-info progress-bar-striped"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{width: progress + "%"}}
                        >
                            {progress}%
                        </div>
                    </div>
                )}
                <Dropzone onDrop={onDrop} multiple={false}>
                    {({getRootProps, getInputProps}) => (
                        <section>
                            <div {...getRootProps({className: "dropzone"})}>
                                <input {...getInputProps()} />
                                {selectedFiles && selectedFiles[0].name ? (
                                    <div className="selected-file">
                                        {selectedFiles && selectedFiles[0].name && (
                                            <>
                                                {data?.fileName}.{getOnlyExtensionFromFile(selectedFiles[0].name)}
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    "Przeciągnij i upuść plik tutaj, lub kliknij i wybierz plik"
                                )}
                            </div>
                            {selectedFiles && selectedFiles[0].name && (
                                <div>
                                    <label htmlFor="fileName">Zmień nazwę pliku, jeśli chcesz:</label>
                                    <input type="text" className="form-control" name="fileName"
                                           placeholder="Nazwa pliku" value={data.fileName}
                                           onChange={handleOnChange}/>
                                </div>
                            )}
                            <aside className="selected-file-wrapper">
                                <button
                                    className="btn btn-success"
                                    disabled={!selectedFiles}
                                    onClick={upload}
                                >
                                    Wgraj
                                </button>
                            </aside>
                        </section>
                    )}
                </Dropzone>


                <div className="jumbotron">
                    <h1 className="display-7">Lista plików</h1>
                    <hr className="my-4"/>
                </div>


                {isEmpty(myFiles) ? (
                    <p>Brak</p>
                ) : (
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
                        {myFiles?.map(({id, name, url, extension, size, usedInMessages, usedInPosts}) => (
                            <tr key={id}>
                                <td>
                                    {extension === "jpg" ? (
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
                                    {usedInMessages === 0 && usedInPosts === 0 && (
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
                )}

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

export default HostingFiles;