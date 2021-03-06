import React, {useEffect, useState} from 'react';
import {getSearchFiles} from "../../helpers/Files";
import LoaderScreen from "../../components/LoaderScreen";
import {sortDesc} from "../../helpers/sort";
import UploadFile from "./components/UploadFile";
import ListOfFiles from "./components/ListOfFiles";

const HostingFiles = () => {
    const [showLoader, setShowLoader] = useState(false);
    const [myFiles, setMyFiles] = useState([]);

    useEffect(() => {
        setShowLoader(true);
        getSearchFiles().then(list => {
            sortDesc(list, "id");
            setMyFiles(list);
        }).catch(() => {
        }).finally(async () => {
            await setShowLoader(false);
        })
    }, []);

    return (
        <>
            <div className="jumbotron">
                <h1 className="display-7">Wgraj plik</h1>
                <hr className="my-4"/>
            </div>

            <UploadFile setMyFiles={setMyFiles}/>

            <div className="jumbotron">
                <h1 className="display-7">Lista plików</h1>
                <hr className="my-4"/>
            </div>
            <ListOfFiles myFiles={myFiles} setMyFiles={setMyFiles}/>

            {showLoader && <LoaderScreen/>}
        </>
    )
}

export default HostingFiles;