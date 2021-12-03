import React, {useEffect, useState} from 'react';
import {getFiles, uploadFile} from "../../helpers/Files";
import Dropzone from "react-dropzone";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../components/LoaderScreen";
import {getContacts} from "../../helpers/Message";
import {sortDesc} from "../../helpers/sort";
import {isEmpty} from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

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

    const onDrop = (files) => {
        if (files.length > 0) {
            setSelectedFiles(files);
        }
    }

    const upload = () => {
        setProgress(0);
        setCurrentFile(selectedFiles[0]);

        uploadFile(selectedFiles[0], (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }).then(() => {

            setShowLoader(true);
            getFiles().then(list => {
                sortDesc(list, "id");
                setMyFiles(list);
            }).catch(() => {
            }).finally(async () => {
                await setShowLoader(false);
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

    const handleDeleteFile = () => {

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
                                        {selectedFiles && selectedFiles[0].name}
                                    </div>
                                ) : (
                                    "Przeciągnij i upuść plik tutaj, lub kliknij i wybierz plik"
                                )}
                            </div>
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
                            <th scope="col">#</th>
                            <th scope="col">Nazwa pliku</th>
                            <th scope="col">Rozszerzenie</th>
                            <th scope="col">Rozmiar</th>
                            <th scope="col">&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {myFiles?.map(({id, name, url, extension, size}) => (
                            <tr key={id}>
                                <td>{id}</td>
                                <td><a href={url}>{name}.{extension}</a></td>
                                <td>{extension}</td>
                                <td>{Math.ceil(size/1024)}KB</td>
                                <td>
                                    <button type="button" className="btn btn-danger"
                                            onClick={() => handleDeleteFile()}><FontAwesomeIcon
                                        icon={faTrash}/>
                                    </button>
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