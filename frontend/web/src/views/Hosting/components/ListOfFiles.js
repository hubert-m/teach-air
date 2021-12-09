import {isEmpty} from "lodash";
import SimpleReactLightbox, {SRLWrapper} from "simple-react-lightbox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import {deleteFile, getFiles} from "../../../helpers/Files";
import {sortDesc} from "../../../helpers/sort";
import LoaderScreen from "../../../components/LoaderScreen";

const ListOfFiles = ({myFiles = [], setMyFiles = () => {}}) => {
    const [showLoader, setShowLoader] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

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
            {!isEmpty(myFiles) && (
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