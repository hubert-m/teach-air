import React, {useEffect, useState} from 'react';
import {getFiles, uploadFile} from "../../helpers/Files";
import Dropzone from "react-dropzone";
import SweetAlert from "react-bootstrap-sweetalert";
import LoaderScreen from "../../components/LoaderScreen";

const HostingFiles = () => {

    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [fileInfos, setFileInfos] = useState([]);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const onDrop = (files) => {
        if(files.length > 0) {
            setSelectedFiles(files);
        }
    }

    const upload = () => {
        setProgress(0);
        setCurrentFile(selectedFiles[0]);

        uploadFile(selectedFiles[0], (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        }).then((response) => {
            setSuccessMessage("Pomyślnie udało się wgrać plik :) \n "+response?.data?.file);
            console.log(response?.data?.file);
            setShowSuccess(true);
            // return getFiles();
        }).then((files) => {
            setFileInfos(files.data);
        }).catch(() => {
            setProgress(0);
            //setErrorMessage("Nie udało się wgrać pliku");
            //setShowError(true);
            setCurrentFile(undefined);
        })

        setSelectedFiles(undefined);
    }

    useEffect(() => {
        /*
        getFiles().then(res => {
            setFileInfos(res);
        })
         */
    },[]);


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
                            style={{ width: progress + "%" }}
                        >
                            {progress}%
                        </div>
                    </div>
                )}
                <Dropzone onDrop={onDrop} multiple={false}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div {...getRootProps({ className: "dropzone" })}>
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
                {fileInfos.length > 0 && (
                    <div className="card">
                        <div className="card-header">Lista plików</div>
                        <ul className="list-group list-group-flush">
                            {fileInfos.map((file, index) => (
                                <li className="list-group-item" key={index}>
                                    <a href={file.url}>{file.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
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
        </>
    )
}

export default HostingFiles;