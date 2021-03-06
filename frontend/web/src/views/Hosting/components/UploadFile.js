import Dropzone from "react-dropzone";
import {cutExtensionFromFile, getOnlyExtensionFromFile} from "../../../helpers/fileNames";
import React, {useState} from "react";
import {getSearchFiles, uploadFile} from "../../../helpers/Files";
import {sortDesc} from "../../../helpers/sort";
import SweetAlert from "react-bootstrap-sweetalert";
import {setProfileImage} from "../../../helpers/User";

const UploadFile = ({
                        setMyFiles = () => {
                        }, attachFile = false, handlePushFileToArr = () => {
    }, keyword = "", extensions = "", changeProfile = "", setUserData = {}
                    }) => {

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [data, setData] = useState({
        fileName: '',
    });

    const onDrop = (files) => {
        if (files.length > 0) {
            setSelectedFiles(files);
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
        }).then((res) => {

            getSearchFiles(keyword, extensions).then(list => {
                sortDesc(list, "id");
                setMyFiles(list);

                if (attachFile) {
                    handlePushFileToArr(res?.data)
                }

            }).catch(() => {})

            if (changeProfile != "") {
                setProfileImage(res?.data?.url).then((res_user) => {
                    setUserData(res_user?.auth);
                }).catch(() => {})
            }

            setSuccessMessage("Pomy??lnie uda??o si?? wgra?? plik :)");
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

    const handleOnChange = (e) => {
        const result = {};
        result[e.target.name] = e.target.value;
        setData((prevState) => ({
            ...prevState,
            ...result,
        }))
    }

    return (
        <>
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
                                "Przeci??gnij i upu???? plik tutaj, lub kliknij i wybierz plik"
                            )}
                        </div>
                        {selectedFiles && selectedFiles[0].name && (
                            <div>
                                <label htmlFor="fileName">Zmie?? nazw?? pliku, je??li chcesz:</label>
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
                {successMessage}
            </SweetAlert>
        </>
    )
}

export default UploadFile;