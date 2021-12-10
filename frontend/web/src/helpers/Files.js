import axios from "axios";
import Settings from "../constants/Settings";
import ApiEndpoints from "../constants/ApiEndpoints";

const uploadFile = (file, fileName, onUploadProgress) => {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);

        const config = {
            headers: {
                token: localStorage.getItem("userToken"),
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        };

        axios.post(Settings.API + ApiEndpoints.UPLOAD_FILE, formData, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
}

const getSearchFiles = (keyword = "", extension = "") => {
    return new Promise((resolve, reject) => {

        const data = {
            keyword: keyword,
            extension: extension
        };

        const config = {
            headers: {
                token: localStorage.getItem("userToken"),
                "Content-type": "application/json"
            }
        };

        axios.post(Settings.API + ApiEndpoints.SEARCH_FILES, data, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
}

const deleteFile = (id) => {
    return new Promise((resolve, reject) => {
        const config = {headers: {token: localStorage.getItem("userToken")}};
        axios.delete(Settings.API + ApiEndpoints.DELETE_FILE + id, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            let message = "Nie udało się połączyć z serwerem";
            if (error.response && error.response.data.error) {
                message = error.response.data.error;
            }
            reject(message);
        });
    });
};

export {
    uploadFile,
    getSearchFiles,
    deleteFile
}